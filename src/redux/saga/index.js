import { all } from "redux-saga/effects";

import Login from "./loginSaga";
import Logout from "./logoutSaga";
import ForgotPassword from "./forgotPasswordSaga";
import ResetPassword from "./resetPasswordSaga";
import GoogleLogin from "./SocialLogin/googleLoginSaga";
import LinkedInAccessTokenUser from "./SocialLogin/linkedinAccessTokenSaga";
import LinkedInGetProfileUser from "./SocialLogin/linkedinGetProfileSaga";
import InstagramAccessToken from "./SocialLogin/instagramAccessTokenSaga";
import InstagramGetProfile from "./SocialLogin/instagramGetProfileSaga";
import PhotographerRegister from "./PhotographerModule/photographerRegisterSaga";
import ClientRegister from "./ClientModule/clientRegisterSaga";
import ClientUpdate from "./ClientModule/clientUpdateSaga";
import ClientLogin from "./ClientModule/clientLoginSaga";
import UpdatePhotographer from "./PhotographerModule/updatePhotographerSaga";
import CameraType from "./CommonSaga/cameraSaga";
import EquipementType from "./CommonSaga/equipementSaga";
import LensType from "./CommonSaga/lensSaga";
import SmartPhoneType from "./CommonSaga/smartPhoneSaga";
import CategoryType from "./CommonSaga/categorySaga";
import SectorType from "./CommonSaga/sectorSaga";
import ImagesType from "./CommonSaga/imagesSaga";
import UserProfile from "./PhotographerModule/userProfileSaga";
import ImagesUpload from "./CommonSaga/uploadImagesSaga";
import LanguageSelector from "./CommonSaga/languageSelectorSaga";
import IsImageUploaded from "./PhotographerModule/isImageUploadedSaga";
import getPhotographerJob from "./JobModule/getPhotographerSaga";
import getPhotographerProductionAdditionalMedia from "./JobModule/getPhotographerProductionAddionalMediaSaga";
import AcceptPhotographerJob from "./JobModule/acceptPhotographerSaga ";
import RejectPhotographerJob from "./JobModule/rejectPhotographerSaga";
import EditJobProfile from "./JobModule/editJobProfileSaga";
import GetJobDetail from "./JobModule/getJobDetailSaga";
import GetJobDetailPreset from "./JobModule/getJobDetailPresetSaga";
import ClientProfileUpdate from "./ClientModule/clientProfileUpdateSaga";
import GetClientJob from "./ClientModule/getClientJobSaga";
import InviteTeamMember from "./ClientModule/inviteTeamMemberSaga";
import GetClientDetail from "./ClientModule/getClientDetailSaga";
import GetTeamMember from "./ClientModule/getTeamMemberSaga";
import DeleteTeamMember from "./ClientModule/deleteTeamMemberSaga";
import GetShootType from "./ClientModule/getShootTypeSaga";
import GetSubCategory from "./ClientModule/getSubCategorySaga";
import GetSubCategoryItem from "./ClientModule/getSubCategoryItemSaga";
import GetEditingVisual from "./ClientModule/getVisualEditingSaga";
import CreateOrder from "./ClientModule/createOrderSaga";
import RequestReUpload from "./JobModule/requestReUploadSaga";
import EditorUpdate from "./EditorModule/editorUpdateSaga";
import EditorStatusUpdate from "./EditorModule/editorStatusUpdateSaga";
import GetJobListEditor from "./EditorModule/getJobListEditorSaga";
import GetJobDetailEditor from "./EditorModule/getJobDetailEditorSaga";
import GetEditorAdditionalMedia from "./EditorModule/getEditorAdditionalMediaSaga";
import GetEditorUploadMedia from "./EditorModule/getEditorUploadMediaSaga";
import GetEditorAssigningMedia from "./EditorModule/getEditorAssigningMediaSaga";
import GetEditorImageLink from "./EditorModule/getEditorImageLinkSaga";
import GetVideoEditing from "./EditorModule/getVideoEditingSaga";
import DeleteRawImage from "./PhotographerModule/deleteRawImageSaga";
import downloadInitialMedia from "./PhotographerModule/downloadInitialMediaSaga";
import acceptRaiseOrderJob from "./CommonSaga/acceptRaiseOrderJobSaga";
import resendEmail from "./CommonSaga/resendEmailSaga";
import ImpersonateLogin from "./ImpersonateLoginSaga";
import ImpersonateClientLogin from "./ImpersonateClientLoginSaga";

export default function* rootSaga() {
    yield all([
        Login(),
        Logout(),
        ForgotPassword(),
        ResetPassword(),
        PhotographerRegister(),
        ClientRegister(),
        ClientUpdate(),
        ClientLogin(),
        GoogleLogin(),
        LinkedInAccessTokenUser(),
        LinkedInGetProfileUser(),
        InstagramAccessToken(),
        InstagramGetProfile(),
        UpdatePhotographer(),
        CameraType(),
        EquipementType(),
        LensType(),
        SmartPhoneType(),
        CategoryType(),
        SectorType(),
        ImagesType(),
        ImagesUpload(),
        UserProfile(),
        LanguageSelector(),
        IsImageUploaded(),
        getPhotographerJob(),
        getPhotographerProductionAdditionalMedia(),
        AcceptPhotographerJob(),
        RejectPhotographerJob(),
        EditJobProfile(),
        GetJobDetail(),
        ClientProfileUpdate(),
        GetClientJob(),
        InviteTeamMember(),
        GetClientDetail(),
        GetTeamMember(),
        DeleteTeamMember(),
        GetShootType(),
        GetSubCategory(),
        GetSubCategoryItem(),
        CreateOrder(),
        RequestReUpload(),
        EditorUpdate(),
        DeleteRawImage(),
        GetEditingVisual(),
        GetJobDetailPreset(),
        GetJobListEditor(),
        GetJobDetailEditor(),
        GetEditorAssigningMedia(),
        GetEditorUploadMedia(),
        GetEditorAdditionalMedia(),
        GetEditorImageLink(),
        GetVideoEditing(),
        downloadInitialMedia(),
        EditorStatusUpdate(),
        acceptRaiseOrderJob(),
        resendEmail(),
        ImpersonateLogin(),
        ImpersonateClientLogin()
    ]);
}