 export const REGISTER_QUERY_PARAMS = process.env?.REACT_APP_REGISTER_QUERY_PARAMS?.split(",");
 
 function searchParams() {
    const parameters = {};
     const parts = window.location.search.replace("?", "").split("&");
     const isAuthenticated = localStorage.getItem("access_token");

     parts.forEach(couple => {
         const param = couple?.split("=");

         parameters[param[0]] = param[1];
     });
     const sourceKeysLength = Object.keys(parameters).length;

     if (parameters.stag) {
         localStorage.setItem("stag", parameters.stag);
         delete parameters.stag;
     }
     if (parameters.lang) {
         localStorage.setItem("i18nextLng", parameters.lang);
         delete parameters.lang;
     }
     REGISTER_QUERY_PARAMS?.forEach(key => {
        if (parameters[key]) {
            if (!isAuthenticated) {
                localStorage.setItem(key, parameters[key]);
            }
            delete parameters[key];
        }
     })

     const newKeys = Object.keys(parameters);

     if (sourceKeysLength !== newKeys.length) {
         const searchArray = [];
         newKeys.forEach(key => {
             searchArray.push(`${key}=${parameters[key]}`);
         });
         window.history.pushState({}, '', `${window.location.pathname}${searchArray.length > 0 ? "?" : ""}${searchArray.join("&")}`);
         // window.location.href = `${window.location.pathname}?${searchArray.join("&")}`;
     }
 }

 searchParams();