import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Button } from "../../component/CommonComponent";
import plusIcon from "../../assets/images/plusIcon.svg";
import arrowIcon from "../../assets/images/cart-arrow-icon.svg";
import { getLocalStorageItem, priceFormat, removeLocalStorageItem } from "../../utils/helper";
import {
    categoryType,
    getShootType,
    getVisualEditing
} from "../../redux/action";
import Header from "../../component/layout/Header";

export default function Cart() {
    const {i18n, t } = useTranslation();

    const [form, setForm] = useState({});

    const [cartDetail, setCartDetail] = useState({});
    const [cartDetailSummary, setCartDetailSummary] = useState([]);

    const [changeLang, setChangeLang] = useState("en");
    const [count, setCount] = useState(0);

    //delete sub category item
    const [index, setIndex] = useState(0);
    const [shootTypeId, setShootTypeId] = useState(0);
    const [subCategoryId, setSubCategoryId] = useState(0);

    const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
    const [isDeleteCategoryItemOpen, setIsDeleteCategoryItemOpen] = useState(false);

    const [orderToggle, setOrderToggle] = useState(0);
    const [defaultOpenFlag, setDefaultOpenFlag] = useState(true);

    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    let userData = JSON.parse(getLocalStorageItem("userData"));
    var placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));
    var placeAnOrderArrayCount = JSON.parse(getLocalStorageItem("editOrder"));

    const shoot_types = useSelector((state) => state?.GetShootType?.shootType);

    const category_types = useSelector(
        (state) => state?.CategoryType?.categoryArray
    );

    const visual_editing = useSelector(
        (state) => state?.GetEditingVisual?.editingType
    );

    var totalPriceZero = JSON.parse(getLocalStorageItem("totalPriceZero"));

    const [placeOrderList, setPlaceOrderList] = useState(placeAnOrderArray || []);

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.value);
        setChangeLang(event.value);
    }

    const cartDetails = (e, cart) => {
        e.preventDefault();
        init(cart);
    };

    const cancelAndRedirect = (e) => {
        e.preventDefault();
        removeLocalStorageItem("placeAnOrder");
        removeLocalStorageItem("count");
        removeLocalStorageItem("totalPriceZero");
        removeLocalStorageItem("editOrder");
        removeLocalStorageItem("sub_category");
        setIsDeleteTeamOpen(false);
        history.push('/place-an-order');
    };

    const editOrder = (e, order, indexes) => {
        e.preventDefault();
        removeLocalStorageItem("totalPriceZero");
        localStorage.setItem("editOrder", JSON.stringify(order));
        let placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));
        let updatedOrder = placeAnOrderArray?.filter((order, index) => index !== indexes);
        localStorage.setItem("placeAnOrder", JSON.stringify(updatedOrder));
        history.push("/place-an-order");
    };

    const deleteOrderShootType = (e, index, shootTypeId, subCategoryId, order) => {
        e.preventDefault();

        setIsDeleteCategoryItemOpen(true);
        setIndex(index);
        setShootTypeId(shootTypeId);
        setSubCategoryId(subCategoryId);
    };

    const deleteSubCategoryItem = (e) => {
        e.preventDefault();

        const placeAnOrder = placeAnOrderArray?.map((place, key) => key != index ? place : { ...place, order_by: place.order_by?.map((order) => order?.shoot_type_id == shootTypeId ? { ...order, sub_category: order?.sub_category?.filter((category) => category?.sub_category_id != subCategoryId) } : order) });
        var countItem = 0;

        let selectedOrder = placeAnOrder?.filter((order, indexes) => indexes === index);

        init(selectedOrder[0]);
        setCartDetail(selectedOrder[0]);
        selectedOrder[0]?.order_by?.map((orderItem) => {
            return orderItem?.sub_category?.filter((subCategoryItem) => {
                if (subCategoryItem?.item_id !== null) {
                    countItem++;
                }
            })
        })

        if (countItem === 0) {
            let updatedOrder = placeAnOrder?.filter((order, indexes) => indexes !== index);

            setOrderToggle(0);
            init(updatedOrder[0]);
            setCartDetail(updatedOrder[0]);

            setPlaceOrderList(updatedOrder);
            localStorage.setItem("placeAnOrder", JSON.stringify(updatedOrder));
        } else {
            setPlaceOrderList(placeAnOrder);
            localStorage.setItem("placeAnOrder", JSON.stringify(placeAnOrder));
        }

        setIsDeleteCategoryItemOpen(false);
        setIndex(0);
        setShootTypeId(0);
        setSubCategoryId(0);
    }

    // get and set the order details
    const init = async (cart) => {
        setForm({});
        setCartDetail(cart);
        var vat_in_percentage = 12.25 / 100;

        var total_price = 0;
        let gross_price = 0;

        let cartDetail = [];
        setCartDetailSummary([]);
        if (cart?.category_id) {
            cart?.order_by?.map((order) => {
                let shootType = shoot_types?.type?.find((ele) => ele?.id === order?.shoot_type_id);
                if (shootType !== undefined) {
                    setForm((prevState) => ({
                        ...prevState,
                        [shootType?.type_slug]: shootType?.id
                    }));

                    let shootEditing = cart?.editing?.find((ele) => ele?.shoot_type_id === shootType?.id)?.item_id;

                    setForm((prevState) => ({
                        ...prevState,
                        [shootType?.type_slug + '_editing']: shootEditing
                    }));

                    order?.sub_category?.map((sub_category_item) => {

                        if (sub_category_item?.item_id !== null) {
                            let subcategory_item_value = sub_category_item?.sub_category_array?.find((item_value) => item_value?.id === sub_category_item?.item_id);
                            if (subcategory_item_value !== null) {
                                total_price = total_price + subcategory_item_value?.price_integer;
                            }
                        }
                    });

                    let vat = total_price * vat_in_percentage;
                    let after_vat_tax = total_price + vat;
                    cartDetail.push({
                        shoot_type_id: shootType?.id,
                        'TotalPrice': total_price,
                        'TaxPrice': Math.round(vat),
                        "After_vat_tax": Math.round(after_vat_tax)
                    })

                    gross_price = gross_price + Math.round(after_vat_tax);
                    setForm((prevState) => ({
                        ...prevState,
                        ['total']: gross_price,
                    }));
                }
            })
        }

        setCartDetailSummary(cartDetail);

        setForm((prevState) => ({
            ...prevState,
            ['category_id']: cart?.category_id,
        }));
        setForm((prevState) => ({
            ...prevState,
            ['payment_type']: cart?.payment_type,
        }));
    }

    // api call of categoryType, getShootType, getVisualEditing
    useEffect(() => {
        dispatch(categoryType());
        dispatch(getShootType());
        dispatch(getVisualEditing());
    }, [])

    /* set the logic if limit criteria exceeded which in greater than 50, than the product price summary will not show, instead 
       it will show "contact to sales" message*/ 
    useEffect(() => {
        if (placeAnOrderArrayCount?.editing?.length > 0) {
            removeLocalStorageItem("count");
            var data = [];
            if (placeAnOrderArray?.length > 0) {

                placeAnOrderArray?.push(placeAnOrderArrayCount);
                localStorage.setItem("placeAnOrder", JSON.stringify(placeAnOrderArray));
            } else {

                data?.push(placeAnOrderArrayCount);

                localStorage.setItem("placeAnOrder", JSON.stringify(data));
            }
            removeLocalStorageItem("editOrder");
        }

        placeAnOrderArray?.length > 0 && placeAnOrderArray?.map((placeOrderder) => {
            placeOrderder?.order_by?.map((shoot_type) => {
                shoot_type?.sub_category?.map((sub_category_item) => {
                    sub_category_item?.sub_category_array?.map((sub_category_value) => {
                        if (sub_category_value?.limit_criteria === "exceed" && sub_category_value?.id === sub_category_item?.item_id) {
                            let booleanFlag = true;
                            localStorage.setItem("totalPriceZero", booleanFlag);
                        }
                    })
                })
            })
        })

    }, []);

    // route redirect as per the user login details.
    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                } else {
                    if (userData?.is_updated_steps === "1") {
                        history.push("/sign-up-next");
                    } else if (userData?.is_updated_steps === "2") {
                        history.push("/sign-up-next2");
                    } else if (userData?.is_updated_steps === "3") {
                        history.push("/sign-up-next3");
                    } else if (userData?.is_updated_steps === "4") {
                        history.push("/sign-up-next5");
                    } else if (
                        userData?.is_updated_steps === "0"
                    ) {
                        history.push("/sign-up");
                    }
                }
            } else if (userData?.roles[0]?.id === 7) {
                if (userData?.is_profile_completed === 1) {

                    history.push("/cart");
                } else {
                    history.push("/sign-up-client");
                }
            } else if (userData?.roles[0]?.id === 6) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/editor-dashboard");
                } else {
                    history.push("/sign-up-editor");
                }
            }
        } else {
            history.push("/");
        }

        return () => {
            setCount(0); // This worked for me
        };

    }, []);

    /* set the logic if limit criteria exceeded which in greater than 50, than the product price summary will not show, instead 
       it will show "contact to sales" message*/ 
    // AND
    // place order will set in the local storage   
    useEffect(() => {
        var countOrder = JSON.parse(getLocalStorageItem("count"));
        var reload = null;
        if (placeAnOrderArray !== null) {

            init(placeAnOrderArray[0]);
            setPlaceOrderList(placeAnOrderArray);

            placeAnOrderArray?.length > 0 && placeAnOrderArray?.map((placeOrderder) => {
                placeOrderder?.order_by?.map((shoot_type) => {
                    shoot_type?.sub_category?.map((sub_category_item) => {
                        sub_category_item?.sub_category_array?.map((sub_category_value) => {
                            if (sub_category_value?.limit_criteria === "exceed" && sub_category_value?.id === sub_category_item?.item_id) {
                                let booleanFlag = true;
                                localStorage.setItem("totalPriceZero", booleanFlag);
                            }
                        })
                    })
                })
            })
        }
        clearTimeout(reload);
        if (defaultOpenFlag) {
            reload = setTimeout(() => {
                if (count < 1) {
                    setCount(count + 1);
                }
            }, 3000)
        }

        if (placeAnOrderArrayCount === null) {

            if (countOrder === 0) {

                localStorage.setItem("count", 1);
                let placeAnOrder = JSON.parse(getLocalStorageItem("placeAnOrder"));

                if (placeAnOrder !== null) {
                    if (defaultOpenFlag) {
                        setDefaultOpenFlag(false);
                        setOrderToggle(0);
                        init(placeAnOrder[0]);
                        if (countOrder === 0) {
                            placeAnOrder?.push(location?.state);
                            localStorage.setItem("placeAnOrder", JSON.stringify(placeAnOrder));
                        }
                    }
                } else {
                    if (defaultOpenFlag) {
                        setDefaultOpenFlag(false);
                        setOrderToggle(0);
                        init(location?.state);
                        if (countOrder === 0) {
                            let data = [];
                            data.push(location?.state);
                            localStorage.setItem("placeAnOrder", JSON.stringify(data));
                        }
                    }

                }
            }
        }

    }, [count])

    return (
        <>
            {isDeleteCategoryItemOpen && (
                <div
                    className={`modal fade ${isDeleteCategoryItemOpen ? "show d-block bg-blur" : "d-none"
                        }`}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3">
                            <div className="modal-header bg-red border-bottom-0">
                                <h5 className="modal-title"></h5>
                                <i
                                    className="fa fa-close cursor-pointer"
                                    onClick={() => setIsDeleteCategoryItemOpen(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                        <h5>Are you sure to delete?</h5>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">                               
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <Button
                                    text="NO"
                                    className="model-button-width"
                                    onClick={() => setIsDeleteCategoryItemOpen(false)}
                                />
                                <Button
                                    text="yes"
                                    className="model-button-width text-uppercase"
                                    onClick={(e) => deleteSubCategoryItem(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteTeamOpen && (
                <div
                    className={`modal fade ${isDeleteTeamOpen ? "show d-block bg-blur" : "d-none"
                        }`}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3">
                            <div className="modal-header bg-red border-bottom-0">
                                <h5 className="modal-title"></h5>
                                <i
                                    className="fa fa-close cursor-pointer"
                                    onClick={() => setIsDeleteTeamOpen(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                        <h5>Are you sure you want to delete the order?</h5>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <Button
                                    text="NO"
                                    className="model-button-width"
                                    onClick={() => setIsDeleteTeamOpen(false)}
                                />
                                <Button
                                    text="yes"
                                    className="model-button-width text-uppercase"
                                    onClick={(e) => cancelAndRedirect(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Header isJob={true} langSelector={false} logoutFlag={false} orderCount={placeAnOrderArray?.length || placeAnOrderArrayCount?.length} client={true} />
            <section className="signUpNext-main ">
                <div className='container'>
                    <div className="row justify-content-center">
                        <div className="col-10 col-sm-12 col-md-8 signUpNext-detail py-5 animated fadeIn place-an-order cart">
                            <div className="place-order-heading text-center">
                                <p className="text_body">Cart</p>
                                {placeAnOrderArray?.length > 0 ? <h6 className='sub-title'>See your order before confirmation</h6> : ""}
                            </div>
                            {placeAnOrderArray?.length > 0 ?
                                <form className="cart-inner mx-4 justify-content-between  d-flex flex-wrap">
                                    <div className='cart-left'>
                                        <div className='add-location-btn text-end'>
                                            <a className='cursor-pointer' onClick={() => {
                                                history.push('/place-an-order');
                                            }}><span><img src={plusIcon} alt="" /> </span> Add another location</a>
                                        </div>

                                        {placeOrderList?.length > 0 && placeOrderList?.map((order, index) => {
                                            return (
                                                <div key={index} className='cart-left-one'>
                                                    <div onClick={(e) => {
                                                        setOrderToggle(index);
                                                        cartDetails(e, order, index);
                                                    }} className='cart-left-one-btn d-flex flex-wrap align-item-center justify-content-between'>
                                                        <h5 className='cart-left-title'>Your Order at: <span> {order?.address}</span></h5>
                                                        <img className={`${orderToggle === index ? "arrow-up" : ""}`} src={arrowIcon} alt="" />
                                                    </div>
                                                    {orderToggle === index ?
                                                        <div className='cart-left-one-table'>
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Shoots Type:</th>
                                                                        <th >Category</th>
                                                                        <th >Sub-Category</th>
                                                                        <th >Number of media</th>
                                                                        <th  >Editing</th>
                                                                        <th  >Modify Order</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order?.order_by?.map((shootType, shootTypeIndex) => {
                                                                        return (
                                                                            shootType?.sub_category?.map((sub_category_item, sub_index) => {
                                                                                if (sub_category_item?.item_id !== null) {
                                                                                    return (
                                                                                        <tr key={sub_index}>
                                                                                            <td>{shoot_types?.type?.find((shoot) => shoot?.id === shootType?.shoot_type_id)?.type_name}</td>
                                                                                            <td>{category_types?.category?.find((sub_category) => sub_category?.id === order?.category_id)?.name}</td>
                                                                                            <td>{sub_category_item?.sub_category_response?.find((sub_category) => sub_category?.id === sub_category_item?.sub_category_id)?.sub_category_name}</td>

                                                                                            <td>{sub_category_item?.sub_category_type?.find(
                                                                                                (item) => item?.value === sub_category_item?.item_id
                                                                                            )?.label
                                                                                            }</td>

                                                                                            <td >{visual_editing?.find((editing_visual) => editing_visual?.id === order?.editing?.find((editing) => editing?.shoot_type_id === shootType?.shoot_type_id)?.item_id)?.editing_name}
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className='table-btn'>
                                                                                                    <a onClick={(e) => { editOrder(e, order, index) }} className='edit-btn' href="#">Edit</a>
                                                                                                    <a onClick={(e) => { deleteOrderShootType(e, index, shootType?.shoot_type_id, sub_category_item?.sub_category_id, order) }} className='delete-btn' href="#">delete</a>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                }

                                                                            })
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        : " "}

                                                </div>
                                            )
                                        })}

                                    </div>
                                    <div className='cart-right'>
                                        {totalPriceZero ? <div className='sale-contact'>
                                            <h4>Sales person will be contacting you soon</h4>
                                        </div> : <div className='cart-right-content'>
                                            <div className='invoice-radio d-flex flex-row-reverse  justify-content-end'>
                                                <input id="test11" type="radio" name="payment_type" onChange={() => { }} value={form?.payment_type} checked={form?.payment_type === 2 ? true : form?.payment_type === 1 ? true : false} />
                                                {form?.payment_type === 1 ? "Invoice by email" : form?.payment_type === 2 ? "Card Payment" : ""}
                                                <label htmlFor="test11" title="item2" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                            <div className='your-order-block'>
                                                <div className='your-order'>
                                                    <div className='your-order-title justify-content-between  d-flex flex-wrap border-bottom'>
                                                        <h4 className='order-title'>Your Order</h4>
                                                        <h4 className='order-price'>Price</h4>
                                                    </div>

                                                    {cartDetail?.order_by?.map((shootType, shootTypeIndex) => {
                                                        if (shootType?.sub_category?.length !== 0) {
                                                            return (
                                                                <div key={shootTypeIndex}>
                                                                    <div className='your-order-content justify-content-between  d-flex flex-wrap'>
                                                                        <div className='order-content-title'>
                                                                            <h3>{category_types?.category?.find((sub_category) => sub_category?.id === cartDetail?.category_id)?.name} <span>{shoot_types?.type?.find((shoot) => shoot?.id === shootType?.shoot_type_id)?.type_name}</span></h3>
                                                                            <h3 className='plan'>{visual_editing?.find((editing_visual) => editing_visual?.id === cartDetail?.editing?.find((editing) => editing?.shoot_type_id === shootType?.shoot_type_id)?.item_id)?.editing_name}</h3>
                                                                        </div>
                                                                        <h3 className='order-content-price'>{priceFormat(cartDetailSummary?.find((shoot) => shoot?.shoot_type_id === shootType?.shoot_type_id)?.TotalPrice)}</h3>
                                                                    </div>
                                                                    <div className='your-order-content justify-content-between  d-flex flex-wrap'>
                                                                        <div className='order-content-title'>
                                                                            <h3>Subtotal</h3>
                                                                        </div>
                                                                        <h3 className='order-content-price'>{priceFormat(cartDetailSummary?.find((shoot) => shoot?.shoot_type_id === shootType?.shoot_type_id)?.After_vat_tax)}</h3>
                                                                    </div>
                                                                    <div className='your-order-content justify-content-between  d-flex flex-wrap border-bottom'>
                                                                        <div className='order-content-title'>
                                                                            <h3>Tax(12.25%)</h3>
                                                                        </div>
                                                                        <h3 className='order-content-price'>{priceFormat(cartDetailSummary?.find((shoot) => shoot?.shoot_type_id === shootType?.shoot_type_id)?.TaxPrice)}</h3>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                    })}

                                                    <div className='your-order-content justify-content-between  d-flex flex-wrap total'>
                                                        <div className='order-content-title'>
                                                            <h3>Total</h3>
                                                        </div>
                                                        <h3 className='order-content-price'>{priceFormat(form?.total)}</h3>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>}

                                        <div className='your-order-btn'>
                                            <a className='cursor-pointer' onClick={(e) => { setIsDeleteTeamOpen(true) }}>cancel</a>
                                            {placeAnOrderArray?.length ? <a className="cursor-pointer" onClick={() => {
                                                removeLocalStorageItem("count");
                                                history.push('/check-out');
                                            }}>Place Order</a> : ""}

                                        </div>
                                    </div>
                                </form> : <div className="place-order-heading text-center">
                                    <h6 className='sub-title'>There is no order in your cart</h6>
                                </div>}

                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section></>
    );
};