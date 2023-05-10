const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://54.175.135.210:7687',
                  neo4j.auth.basic('neo4j', 'breezes-visibilities-circumstance'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});


// const personName = 'Alice'


const findPeopleTheSameFavorites = async (id)=>{
  const session = driver.session({database:'neo4j'});
  try{
      console.log('deo');
        
    const result = await session.run(`match (u:user),(f:favorites) where u.id='${id}' match (u)-[r:like]->(f) match (u1:user)-[r1:like]->(f) where u1.id<>'${id}'  with u1,u where not (u)-[:FOLLOWING]->(u1) return u1`)
    const kq =result.records.map(i=>{
      console.log(i.get('u1').properties.id)
      return (i.get('u1').properties.id)
     
    }  )
  
  
   return kq;
  
  } catch{
    await session.close()
    return {message:'Failed'};
  }
    
}


const findFriendOfFriend = async (id)=>{
 


  const session = driver.session({database:'neo4j'});
  try{
      console.log('deo');
        
    const result = await session.run(` match (a:user {id:'${id}'})-[:FOLLOWING]->(b:user)-[:FOLLOWING]->(u1:user) where not (a)-[:FOLLOWING]->(u1) and u1<>a return u1`)
    const kq =result.records.map(i=>{
      console.log(i.get('u1').properties.id)
      return (i.get('u1').properties.id)
     
    }  )
  
  
   return kq;
  
  } catch{
    await session.close()
    return {message:'Failed'};
  }
    
}

//     const findAll = async ()=>{
// const session = driver.session({database:'neo4j'})

//      const result = await session.run(`match (u:Person) return u`)
//       return result.records.map(i=>i.get('u').properties)
//     }
//     const findById =async (id)=>{
//       const result= await session.run(`match (u:User {_id:'${id}'}) return u limit 1`)
//       return result.records[0].properties
//     }

 const create = async (user)=>{
  const session = driver.session({database:'neo4j'});
    try {
    const result = await session.run(`CREATE (u:user {id:'${user.id}'})`);
  console.log(user)
      
    } catch (error) {
    await session.close()
      
    }
    // const result = await session.run(`CREATE (u:User {_id:'${Math.floor((new Date().getTime() * Math.random())).toString()}' , name:'${user.name}', phone:'${user.phone}'})`)

    // return result.records[0].properties
  
}


const follow = async (userid,id)=>{
  const session = driver.session({database:'neo4j'});
    try {
    const result = await session.run(`match (a:user {id:'${id}'}),(b:user {id:'${userid}'})  create (a)-[f:FOLLOWING]->(b)  return a,b`);
  return {message:'Successfully'};
      
    } catch (error) {
    await session.close()
    return {message:'Failed'};
    }

}

const unfollow = async (userid,id)=>{
  const session = driver.session({database:'neo4j'});
    try {
    const result = await session.run(`match (a:user {id:'${id}'}),(b:user {id:'${userid}'}), (a)-[f:FOLLOWING]->(b) delete f return a,b
    `);
  return {message:'Successfully'};
    } catch (error) {
    await session.close()
    return {message:'Failed'};
    }
  
  
}

const addFavorites= async (id,favorites=[])=>{
  const session = driver.session({database:'neo4j'});
  try {
     const a= await session.run(`match (u:user {id:'${id}'})-[r:like]->(f:favorites) delete r `)
      console.log(a);
  for (let index = 0; index < favorites.length; index++) {
    const element = favorites[index];
    await session.run(` match (u:user {id:'${id}'}),(f:favorites {name:'${element}'}) create (u)-[r:like]->(f) return r`);
    
  }
  return {message:'Successfully'};
  
    
  } catch (error) {
  await session.close()
  return {message:'Failed'};

  }
 

}


//  const findByAndUpdate = async (id,user)=>{
//   const result = await session.run(`MATCH (u:user {_id:'${id}'}) SET name='${user.name}' , phone='${user.email  }' `)
//   return result.records[0].properties

// }
   
  
  // // on application exit:
  // await driver.close()

module.exports={
    // findAll,findById,findByAndUpdate,
    create,findPeopleTheSameFavorites,addFavorites,findFriendOfFriend,follow,unfollow
  }