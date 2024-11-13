export const getCurrentLogin = () => {
   if (localStorage.getItem('userToken')) {
      const currentEmployee = JSON.parse(
         localStorage.getItem('userToken') as string
      ).user;
      return currentEmployee;
   }
};
