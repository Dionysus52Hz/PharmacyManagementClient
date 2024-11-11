export const getAccessToken = async () => {
   if (localStorage.getItem('userToken')) {
      const accessToken = JSON.parse(
         localStorage.getItem('userToken') as string
      ).accessToken;
      return accessToken;
   }
};
