import { DESO_API_BASE, DESO_WEB_BASE } from "@/config/desoConfig";

export const avatarUrl = (Profile) => {
    const apiPrefix = DESO_API_BASE;
    const webAppPrefix = DESO_WEB_BASE;
  
    if (Profile) {
      let avatarImage = `${apiPrefix}/get-single-profile-picture/${Profile.PublicKeyBase58Check}?fallback=${webAppPrefix}/assets/img/default_profile_pic.png`;
  
      if (Profile.ExtraData?.LargeProfilePicURL) {
        avatarImage = Profile.ExtraData.LargeProfilePicURL;
      }
  
      if (Profile.ExtraData?.NFTProfilePictureUrl) {
        avatarImage = Profile.ExtraData.NFTProfilePictureUrl;
      }
  
      return avatarImage;
    } else {
      return `${webAppPrefix}/assets/img/default_profile_pic.png`;
    }
};
  