export {default as trademark} from './product/trademark'
// export {default as attr }from './product/attr'


//export {default as trademark} from './product/trademark'
//引入并暴露
//可以这么理解
//第一步：引入
// import {default as trademark} from './product/trademark'

// 引入之后 就把这个对象引过来,并且给这个对象赋值给trademark
// trademark = {
//   getPageList(){},
//   delete(){},
//   addOrUpdate
// }

//第二步：并暴露(部分暴露)
// export trademark = {
//   getPageList(){},
//   delete(){},
//   addOrUpdate
// }

// export attr = {
//   //   getPageList(){},
//   //   delete(){},
//   //   addOrUpdate
// }



// 最终从index.js暴露出去的就是
// {
//   trademark,
//   attr
// }


// main里面就可以 import * as $API from '@/api'  拿到暴露出去的整个对象

// $API = {
//     trademark,
//      attr
//  }


// index.js其实就把不同的模块当中接口请求函数整合到同一个文件进行一次性暴露，这样我们就可以直接
//获取到所有的接口请求函数，进行统一的处理
