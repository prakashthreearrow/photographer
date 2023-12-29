import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Footer } from "../../component/CommonComponent";
import arrowIcon from "../../assets/images/cart-arrow-icon.svg";
import Moment from 'moment';
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import { getLocalStorageItem, priceFormat, removeLocalStorageItem } from "../../utils/helper";
import {
    createOrder, categoryType,
    getShootType,
    getVisualEditing
} from "../../redux/action";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import Header from "../../component/layout/Header";

export default function CheckOut() {
    const mountedRef = useRef(true);
    const { t } = useTranslation();

    const [form, setForm] = useState({
        payment_type: 0,

    });

    const [placeAnOrder, setPlaceAnOrder] = useState([]);
    const [netAmount, setNetAmount] = useState(0);

    const [open, setOpen] = React.useState(false);
    const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);

    const [orderToggle, setOrderToggle] = useState(0);
    const [paymentTypeValue, setPaymentTypeValue] = useState(0);
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const shoot_types = useSelector((state) => state?.GetShootType?.shootType);

    const category_types = useSelector(
        (state) => state?.CategoryType?.categoryArray
    );

    const visual_editing = useSelector(
        (state) => state?.GetEditingVisual?.editingType
    );

    let userData = JSON.parse(getLocalStorageItem("userData"));
    var placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));
    var placeAnOrderArrayCount = JSON.parse(getLocalStorageItem("editOrder"));
    var totalPriceZero = JSON.parse(getLocalStorageItem("totalPriceZero"));

    const paymentType = (e, index, payment_type) => {
        e.preventDefault();
        setOrderToggle(index);
        setPaymentTypeValue(payment_type?.payment_type);
    };

    // api call of categoryType, getShootType, getVisualEditing
    useEffect(() => {
        dispatch(categoryType());
        dispatch(getShootType());
        dispatch(getVisualEditing());
    }, [])

    /* set the logic if limit criteria exceeded which in greater than 50, than the product price summary will not show, instead 
       it will show "contact to sales" message*/ 
    // AND
    // route redirect as per the user login details.
    useEffect(() => {
        placeAnOrderArray && setPaymentTypeValue(placeAnOrderArray[0]?.payment_type);
        placeAnOrderArray && placeAnOrderArray?.map((placeOrderder) => {
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

                    history.push("/check-out");
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
    }, []);

    // summary details calculation which you can see on the right section of page.
    useEffect(() => {
        var vat_in_percentage = 12.25 / 100;
        let arrayOfOrder = placeAnOrderArray && placeAnOrderArray?.map((cart) => {
            let orderData = [];
            var total_price = 0;

            cart?.order_by?.map((order) => {
                let shootType = shoot_types?.type?.find((ele) => ele?.id === order?.shoot_type_id);
                if (shootType !== undefined) {
                    let shootEditing = cart?.editing?.find((ele) => ele?.shoot_type_id === shootType?.id)?.item_id;

                    if (order?.sub_category?.length !== 0) {
                        order?.sub_category?.map((sub_category_item) => {
                            if (sub_category_item?.item_id !== null) {
                                let subcategory_item_value = sub_category_item?.sub_category_array?.find((item_value) => item_value?.id === sub_category_item?.item_id);
                                if (subcategory_item_value !== null) {
                                    total_price = total_price + subcategory_item_value?.price_integer;
                                }
                            }
                        })

                        let vat = total_price * vat_in_percentage;

                        let after_vat_tax = total_price + vat;

                        orderData.push({
                            shoot_type_id: shootType?.id,
                            category_id: cart?.category_id,
                            editing_type: shootEditing,
                            total_price: Math.round(total_price),
                            tax: Math.round(vat),
                            total_price_tax: Math.round(after_vat_tax),
                            price: Math.round(after_vat_tax),
                            address: cart?.address
                        })
                    }
                }
            })
            return orderData;
        });

        let singleArrayOfOrder = arrayOfOrder?.flat();

        let net_amount = singleArrayOfOrder?.length > 0 && singleArrayOfOrder?.map(order => order?.price)?.reduce((prev, next) => prev + next);
        setNetAmount(net_amount);
        setPlaceAnOrder(arrayOfOrder);
        return () => { mountedRef.current = false }
    }, [shoot_types]);

    const redirectDashboard = (e) => {
        e.preventDefault();
        removeLocalStorageItem("placeAnOrder");
        removeLocalStorageItem("count");
        removeLocalStorageItem("totalPriceZero");
        removeLocalStorageItem("sub_category");
        setOpen(false)
        history.push('/client-dashboard');
    }

    // cancel all order and redirect to dashboard
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

    const handleSubmit = (e) => {
        e.preventDefault();
        let placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));

        const formatYmd = (date) => {
            let yourDate = new Date(date)
            yourDate.setDate(yourDate.getDate() + 1)
            return yourDate.toISOString().split('T')[0]
        };

        const formattedTime = (time) => {
            const value = Moment(time).format('h:mm A');
            return value;

        };

        let temporaryOrderBy = placeAnOrderArray?.map((place) => {
            return ({
                ...place, order_by: place.order_by?.filter((order) => {
                    if (order?.shoot_type_id !== null) {
                        return ({
                            ...order, sub_category: order.sub_category?.filter((category) => {
                                return category;
                            })
                        })
                    }

                })
            })
        })

        let temporaryEditing = temporaryOrderBy?.map((place) => {
            return ({
                ...place, editing: place.editing?.filter((order) => {
                    if (order?.shoot_type_id !== null) {
                        return order;
                    }

                })
            })
        })

        setOnClickButtonToggle(true);
        let order_payload = {
            orders: temporaryEditing?.map((place) => {
                return ({
                    ...place, date_of_shoot: formatYmd(place.date_of_shoot), time_of_shoot: formattedTime(place.time_of_shoot), order_by: place.order_by?.map((order) => {
                        return ({
                            ...order, sub_category: order.sub_category?.map((category) => {
                                if (category?.item_id !== null) {
                                    return ({
                                        item_id: category?.item_id,
                                        sub_category_id: category?.sub_category_id
                                    });
                                }

                            })
                        })

                    })
                })
            })
        }

        dispatch(
            createOrder({
                order_payload,
                callback: (data) => {
                    if (data) {
                        setOpen(true);
                    }
                }
            })
        );
    };

    return (
        <>
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
                    <div className='back-btn'>
                        <img onClick={(e) => { history.push('/cart') }} src={leftArrowIcon} className="arrow arrow-left" alt="logo" />
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-10 col-sm-12 col-md-8 signUpNext-detail py-5 animated fadeIn place-an-order cart">
                            <div className="place-order-heading text-center">
                                <p className="text_body">Checkout</p>
                                {placeAnOrderArray?.length > 0 ? <h6 className='sub-title'>See your order before confirmation</h6> : ""}

                            </div>

                            {placeAnOrderArray?.length > 0 ?
                                <div className="cart-inner mx-4 justify-content-between  d-flex flex-wrap">
                                    <div className='cart-left'>

                                        {placeAnOrderArray?.length > 0 && placeAnOrderArray?.map((order, index) => {
                                            return (
                                                <div key={index} className='cart-left-one'>
                                                    <div onClick={(e) => {
                                                        paymentType(e, index, order);
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
                                                                        <th >Editing</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order?.order_by?.map((shootType) => {
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
                                                                                            )?.label}</td>
                                                                                            <td >{visual_editing?.find((editing_visual) => editing_visual?.id === order?.editing?.find((editing) => editing?.shoot_type_id === shootType?.shoot_type_id)?.item_id)?.editing_name}
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
                                        </div> : <div>
                                            <div className='invoice-radio d-flex flex-row-reverse  justify-content-end'>
                                                <input id="test11" type="radio" name="payment_type" onChange={() => { }} value={paymentTypeValue} checked={form?.payment_type === 2 || 1} />
                                                {paymentTypeValue === 1 ? "Invoice by email" : paymentTypeValue === 2 ? "Card Payment" : ""}
                                                <label htmlFor="test11" title="item2" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                            <div className='your-order-block'>
                                                <div className='your-order'>
                                                    <div className='your-order-title justify-content-between  d-flex flex-wrap border-bottom'>
                                                        <h4 className='order-title'>Your Order</h4>
                                                        <h4 className='order-price'>Price</h4>
                                                    </div>
                                                    {placeAnOrder && placeAnOrder?.map((place_an_order, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div onClick={() => { setOrderToggle(index) }} className='your-order-toggle d-flex flex-wrap align-content-center justify-content-between'>
                                                                    <h5 className="your-order-toggle-title">{place_an_order[0]?.address || place_an_order[1]?.address || place_an_order[2]?.address || place_an_order[3]?.address || place_an_order[4]?.address || place_an_order[5]?.address} </h5>
                                                                    <img className={`${orderToggle === index ? "arrow-up" : " "}`} src={arrowIcon} alt="" />
                                                                </div>
                                                                {place_an_order?.map((place_an_order_list, sub_index) => {
                                                                    return (
                                                                        orderToggle === index ?
                                                                            <div key={sub_index} className='toggle-open'>
                                                                                <div className='your-order-content justify-content-between  d-flex flex-wrap'>
                                                                                    <div className='order-content-title'>
                                                                                        <h3>{category_types?.category?.find((sub_category) => sub_category?.id === place_an_order_list?.category_id)?.name}<span>{shoot_types?.type?.find((shoot) => shoot?.id === place_an_order_list?.shoot_type_id)?.type_name}</span></h3>
                                                                                        <h3 className='plan'>{visual_editing?.find((editing_visual) => editing_visual?.id === place_an_order_list?.editing_type)?.editing_name}</h3>
                                                                                    </div>
                                                                                    <h3 className='order-content-price'>{shoot_types?.type?.find((shoot) => shoot?.id === place_an_order_list?.shoot_type_id)?.id === place_an_order_list?.shoot_type_id ? priceFormat(place_an_order_list?.total_price) : ""}</h3>
                                                                                </div>
                                                                                <div className='your-order-content justify-content-between  d-flex flex-wrap'>
                                                                                    <div className='order-content-title'>
                                                                                        <h3>Subtotal</h3>
                                                                                    </div>
                                                                                    <h3 className='order-content-price'>{shoot_types?.type?.find((shoot) => shoot?.id === place_an_order_list?.shoot_type_id)?.id === place_an_order_list?.shoot_type_id ? priceFormat(place_an_order_list?.total_price_tax) : ""}</h3>
                                                                                </div>
                                                                                <div className='your-order-content justify-content-between  d-flex flex-wrap border-bottom'>
                                                                                    <div className='order-content-title'>
                                                                                        <h3>Tax(12.25%)</h3>
                                                                                    </div>
                                                                                    <h3 className='order-content-price'>{shoot_types?.type?.find((shoot) => shoot?.id === place_an_order_list?.shoot_type_id)?.id === place_an_order_list?.shoot_type_id ? priceFormat(place_an_order_list?.tax) : ""}</h3>
                                                                                </div>

                                                                            </div>
                                                                            : " "
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                    <div className='your-order-content justify-content-between  d-flex flex-wrap total'>
                                                        <div className='order-content-title'>
                                                            <h3>Total</h3>
                                                        </div>
                                                        <h3 className='order-content-price'>{priceFormat(netAmount)}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}

                                        <div >
                                            <Modal
                                                open={open}
                                                closeOnOverlayClick={false}
                                                onClose={() => {
                                                    setOpen(false)
                                                }}
                                                center
                                                classNames={{
                                                    overlay: 'customOverlay',
                                                    modal: 'customModal',
                                                }}
                                            >
                                                <div className='thankYou-modal'>
                                                    <div className='thankYou-modal-inner'>
                                                        <h2 className='ty-headhing'>Thank You</h2>
                                                        <div className='ty-content'>
                                                            <p>Your order is on its way to you, we’re doing everthing our sales team can to get your order to you soon.</p>
                                                        </div>
                                                        <div onClick={(e) => { redirectDashboard(e) }} className="ty-btn">
                                                            <a>Done</a>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Modal>
                                        </div>
                                        <div className={`${onClickButtonToggle ? "disable-btn-one" : ""} your-order-btn`}>
                                            <a className='cursor-pointer' onClick={(e) => { setIsDeleteTeamOpen(true) }}>cancel</a>
                                            {onClickButtonToggle ? <a className='cursor-pointer' >Place Order</a> : <a className='cursor-pointer' onClick={(e) => {
                                                handleSubmit(e)

                                            }}>Place Order</a>}
                                        </div>

                                    </div>
                                </div> : <div className="place-order-heading text-center">
                                    <h6 className='sub-title'>There is no order in your cart</h6>
                                </div>}
                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section></>
    );
};