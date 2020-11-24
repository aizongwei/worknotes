// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({
  throwOnNotFound: false,
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {address,name,phone,isdefault} = event
  try{
      const transaction = await db.startTransaction()
      try{
          if(isdefault=="true"){
            var upres=await transaction.collection('address').where({
              uid:wxContext.OPENID,
              default:true
            }).update({
              data:{
              default:false
              }
            })
          }
          const test=await transaction.collection('config').where({
            key:'phone'
          }).update({
            data:{
            value:15087025353
            }
          })
          const addres=await transaction.collection('address').add({
            // data 字段表示需新增的 JSON 数据
            data: {
            uid: wxContext.OPENID,
            address:address,
            name:name,
            phone:phone,
            default:isdefault
            }
          })
          console.log(upres,addres,a)
          if (upres && addres) {
            await transaction.commit()
            console.log(1111111111111111)
            return {
            success: true
            }
          }else{
            await transaction.rollback()
            console.log(222222222222)
            return {
            success: false
            }
          }
      }catch(e){
          console.log(333333333333333);
          await transaction.rollback()
          return {
            success: false,
            error:e
          }
      }
  }catch(err){
      console.error(`transaction error`, err)
      return {
        success: false,
        error: err
      }
  }
}