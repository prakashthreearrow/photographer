import { combineReducers } from "redux";

import Login from "./loginReducer";
import Logout from "./logoutReducer";
import ForgotPassword from "./forgotPasswordReducer";
import ResetPassword from "./resetPasswordReducer";
import PhotographerRegister from "./PhotographerModule/photographerRegisterReducer";
import ClientRegister from "./ClientModule/clientRegisterReducer";
import ClientUpdate from "./ClientModule/clientUpdateReducer";
import ClientLogin from "./ClientModule/clientLoginReducer";
import LinkedInAccessTokenUser from "./SocialLogin/linkedinAccessTokenReducer";
import LinkedInGetProfileUser from "./SocialLogin/linkedinGetProfileReducer";
import InstagramAccessToken from "./SocialLogin/instagramAccessTokenReducer";
import InstagramGetProfile from "./SocialLogin/instagramGetProfileReducer";
import GoogleLogin from "./SocialLogin/googleLoginReducer";
import UpdatePhotographer from "./PhotographerModule/updatePhotographerReducer";
import CameraType from "./CommonReducer/cameraReducer";
import EquipementType from "./CommonReducer/equipementReducer";
import LensType from "./CommonReducer/lensReducer";
import SmartPhoneType from "./CommonReducer/smartPhoneReducer";
import CategoryType from "./CommonReducer/categoryReducer";
import SectorType from "./CommonReducer/sectorReducer";
import ImagesType from "./CommonReducer/imagesReducer";
import ImagesUpload from "./CommonReducer/imagesUploadReducer";
import UserProfile from "./PhotographerModule/userProfileReducer";
import LanguageSelector from "./CommonReducer/languageSelectorReducer";
import IsImageUploaded from "./PhotographerModule/isImageUploadedReducer";
import getPhotographerJob from "./JobModule/getPhotographerJobReducer";
import getPhotographerProductionAdditionalMedia from "./JobModule/getPhotographerProductionAddionalMediaReducer";
import AcceptPhotographerJob from "./JobModule/acceptPhotographerJobReducer";
import RejectPhotographerJob from "./JobModule/rejectPhotographerJobReducer";
import EditJobProfile from "./JobModule/editJobProfileReducer";
import GetJobDetail from "./JobModule/getJobDetailReducer";
import GetJobDetailPreset from "./JobModule/getJobDetailPresetReducer";
import ClientProfileUpdate from "./ClientModule/clientProfileUpdateReducer";
import GetClientJob from "./ClientModule/getClientJobReducer";
import InviteTeamMember from "./ClientModule/inviteTeamMemberReducer";
import GetClientDetail from "./ClientModule/getClientDetailReducer";
import GetTeamMember from "./ClientModule/getTeamMemberReducer";
import DeleteTeamMember from "./ClientModule/deleteTeamMemberReducer";
import GetShootType from "./ClientModule/getShootTypeReducer";
import GetSubCategory from "./ClientModule/getSubCategoryReducer";
import GetSubCategoryItem from "./ClientModule/getSubCategoryItemReducer";
import GetEditingVisual from "./ClientModule/getVisualEditingReducer";
import CreateOrder from "./ClientModule/createOrderReducer";
import RequestReUpload from "./JobModule/requestReUploadReducer";
import EditorUpdate from "./EditorModule/editorUpdateReducer";
import EditorStatusUpdate from "./EditorModule/editorStatusUpdateReducer";
import GetJobListEditor from "./EditorModule/getJobListEditorReducer";
import GetJobDetailEditor from "./EditorModule/getJobDetailEditorReducer";
import GetEditorAdditionalMedia from "./EditorModule/getEditorAdditionalMediaReducer";
import GetEditorUploadMedia from "./EditorModule/getEditorUploadMediaReducer";
import GetEditorAssigningMedia from "./EditorModule/getEditorAssigningMediaReducer";
import GetEditorImageLink from "./EditorModule/getEditorImageLinkReducer";
import GetVideoEditing from "./EditorModule/getVideoEditingReducer";
import DeleteRawImage from "./PhotographerModule/deleteRawImageReducer";
import downloadInitialMedia from "./PhotographerModule/downloadInitialMediaReducer";
import acceptRaiseOrderJob from "./CommonReducer/acceptRaiseOrderJobReducer";
import resendEmail from "./CommonReducer/resendEmailReducer";
import ImpersonateLogin from "./ImpersonateLoginReducer";
import ImpersonateClientLogin from "./ImpersonateClientLoginReducer";

const appReducer = combineReducers({
    Login,
    Logout,
    ForgotPassword,
    ResetPassword,
    PhotographerRegister,
    ClientRegister,
    ClientUpdate,
    ClientLogin,
    LinkedInAccessTokenUser,
    LinkedInGetProfileUser,
    InstagramAccessToken,
    InstagramGetProfile,
    GoogleLogin,
    UpdatePhotographer,
    CameraType,
    EquipementType,
    LensType,
    SmartPhoneType,
    CategoryType,
    SectorType,
    ImagesType,
    ImagesUpload,
    UserProfile,
    LanguageSelector,
    IsImageUploaded,
    getPhotographerJob,
    getPhotographerProductionAdditionalMedia,
    AcceptPhotographerJob,
    RejectPhotographerJob,
    EditJobProfile,
    GetJobDetail,
    ClientProfileUpdate,
    GetClientJob,
    InviteTeamMember,
    GetClientDetail,
    GetTeamMember,
    DeleteTeamMember,
    GetShootType,
    GetSubCategory,
    GetSubCategoryItem,
    CreateOrder,
    RequestReUpload,
    EditorUpdate,
    DeleteRawImage,
    GetEditingVisual,
    GetJobDetailPreset,
    GetJobListEditor,
    GetJobDetailEditor,
    GetEditorAdditionalMedia,
    GetEditorUploadMedia,
    GetEditorAssigningMedia,
    GetEditorImageLink,
    GetVideoEditing,
    downloadInitialMedia,
    EditorStatusUpdate,
    acceptRaiseOrderJob,
    resendEmail,
    ImpersonateLogin,
    ImpersonateClientLogin
});
const reducers = (state, action) => {
    return appReducer(state, action);
};

export default reducers;