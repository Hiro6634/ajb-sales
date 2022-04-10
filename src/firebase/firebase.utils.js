import firebase  from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/*const config = {
    apiKey: "AIzaSyB_vEdLMXk3Fh649VwaLvg7iWCbwx0Jx08",
    authDomain: "ajbpos.firebaseapp.com",
    databaseURL: "https://ajbpos-default-rtdb.firebaseio.com",
    projectId: "ajbpos",
    storageBucket: "ajbpos.appspot.com",
    messagingSenderId: "955048515609",
    appId: "1:955048515609:web:a1de2316f29d563b6f7288",
    measurementId: "G-RV55F4V3C4"
  };
*/

const config = {
    apiKey: "AIzaSyB_vEdLMXk3Fh649VwaLvg7iWCbwx0Jx08",
    authDomain: "ajbpos.firebaseapp.com",
    projectId: "ajbpos",
    storageBucket: "ajbpos.appspot.com",
    messagingSenderId: "955048515609",
    appId: "1:955048515609:web:01ad37f2cdcbf4016f7288",
    measurementId: "G-F0RFSFCFP6"
  };

export const rootPRODUCTS = 'products';
//export const rootPRINTERS = 'printers';
export const rootUSERS = 'users';

var app = firebase.initializeApp(config);
  

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if( !userAuth) return;

        const userRef = firestore.doc(`${rootUSERS}/${userAuth.uid}`);
        const snapShot = await userRef.get();       
        const printer = '';

       if(!snapShot.exists){
           const {displayName, email} = userAuth;
           const createAt = new Date();

           try {
               await userRef.set({
                   displayName,
                   email,
                   printer,
                   createAt,
                   ...additionalData
               })
           } catch(error){
               console.log('error creating user ', error.message);
           }
       }

       return userRef;
  }

  export const removeProduct = async product =>{
    console.log("DELETE:", product.id);
    try{
        const docRef = firestore.collection(rootPRODUCTS).doc(product.id);
        const snapshot = await docRef.get();
        if( snapshot.exists){
            docRef.delete();
        }
    }  catch(error){
        console.error(error);
    }  
}

export const addOrUpdateProduct = async (product) => {
    console.log("PRODUCT", product );
    try{
        const docRef = firestore.collection(rootPRODUCTS).doc(product.name.toLowerCase());
        const snapshot = await docRef.get();
        if(snapshot.exists){
            await docRef.update(product);
        }
        else{
            await docRef.set(product);
        }
    }
    catch(error){
        console.error(error);
    }
}

export const convertStockSnapshotToMap = stock => {
    const transformedStock = stock.docs.map(doc=>{
        const {stock, warning, autostop, autostop_enable, unit_of_sale} = doc.data();
        return{
            id: doc.id,
            stock: stock ? stock : 0,
            warning: warning ? warning : 0,
            autostop: autostop ? autostop : 0,
            autostop_enable: autostop_enable ? autostop_enable : false,
            unit_of_sale: unit_of_sale ? unit_of_sale : 1
        };
    });

    return transformedStock.reduce((acc, product)=>{
        acc.push(product);
        return acc;
    }, []);
  }

export const convertProductsSnapshotToMap = products => {
    const transformedProducts = products.docs.map(doc=>{
        const {name, category, price, enable, stock, warninglevel, stoplevel, enablestop} = doc.data();

        return {
            id: doc.id,
            iswarning: (stock-warninglevel)<=0,
            name,
            price,
            category,
            enable,
            stock,
            warninglevel,
            stoplevel,
            enablestop
        };
    });

    return transformedProducts.reduce((accumulator, product)=>{
        accumulator[product.name.toLowerCase()] = product;
        return accumulator;
    }, {});
  }
  export const convertCategorySnapshotToMap = categories => {
    const transformedCategories = categories.docs.map(doc=>{
        const {order, name, color} = doc.data();

        return{
            id: doc.id,
            order,
            name,
            color
        };
    });   
    
    return transformedCategories.reduce((accumulator, category)=>{
        accumulator[category.name.toLowerCase()] = category;
        return accumulator;
    },{});
  }

  export const resetCounters = () => {

  }

  export const auth = firebase.auth(app);
  export const firestore = firebase.firestore();
  
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt: 'select_account'});
  export const signInWithGoogle = () => auth.signInWithPopup( provider);

  export default firebase;


