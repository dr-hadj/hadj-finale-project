
 

  let currentPage = 1
  let lastpage = 1
  //==== infinite scroll ===//
   window.addEventListener("scroll", function(){
     
     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
     if(endOfPage && currentPage < lastpage ){
       //4 is in place of  'lastpage'
      currentPage = currentPage +1
      getposts(false , currentPage)
      
     }
   });
  //==== //infinite scroll ===//

  setupUI()
  
  getposts()

  function userClicked(userId){
    
    window.location =`profile.html?userid=${userId}`
  }
  function getposts(reload = true , page = 1){
    toggleloader(true) 
  axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
  .then((response) =>{
    toggleloader(false)
    const posts = response.data.data
  
    lastpage = response.data.meta.last_page



    if(reload){
      document.getElementById("posts").innerHTML =""
    }
   // 
    for(post of posts){
      const author = post.author
      let postTitle =  ""
 /// show or hide (edit) btn
   let user = getCurrentUser()
   let isMyPost = user != null && post.author.id == user.id
   let editBtnContent = ``
   if (isMyPost){
     editBtnContent = ` 
     <button class="btn btn-danger" style="margin-left : 5px;float:right"onclick="deletePostBtnOnclicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
     <button class="btn btn-secondary" style="float:right"onclick="editPostBtnOnclicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
   }
     if (post.title != null)
     {
        postTitle = post.title
     }
      let content =`
         <div class="card shadow">
            <div class="card-header">
              <span onclick="userClicked(${author.id})" style="cursor: pointer">
               <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="height: 40px;width : 40px">
               <b>${author.username}</b>
               </span>
              ${editBtnContent}
            </div>
            <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
              <img class="w-100" src="${post.image}" alt="">
              <h5 style="color: grey;" class="mt-1">${post.created_at}</h5>
              <h5>${postTitle}</h5>
              <p>${post.body}</p>
              <hr>
              <div>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                   <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                   </svg>
                  <span>(${post.comments_count}) comments</span>
              </div>
            </div>
          </div>
      `
      document.getElementById("posts").innerHTML +=content
    }

  })

  }
  
 
 
 



function postClicked(postId){
  //alert(postId)
  window.location =`postDetails.html?postId=${postId}`
  
}


 
 
 function createANewPostPlicked(){
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == ""
  

  const title = document.getElementById("post-title-input").value
   const body = document.getElementById("post-body-input").value
   const image = document.getElementById("post-image-input").files[0]
 
   let formeData = new FormData()
   formeData.append("body",body)
   formeData.append("title",title)
   formeData.append("image",image)
  
   let url = ``
   const token = localStorage.getItem("token")
   const headers = {
     "Content-Type" : "multipart/form-data",
     "authorization": `Bearer ${token}`

   }
   if(isCreate){
     url = `${baseUrl}/posts`
     
   }else{
       formeData.append("_method" ,"put")
    url = `${baseUrl}/posts/${postId}`
   
   }
   axios.post(url,formeData,{
    headers : headers
  })
  .then((response)=>{
   const modal = document.getElementById("create-post-Modal")
   const madalinstance = bootstrap.Modal.getInstance(modal)
    madalinstance.hide()
  
   showAlert ("new post has been created" ,"success")
    
   getposts()


  })
  .catch((error) =>{
   const message = error.response.data.message
   showAlert (message ,"danger")
  })
  
   
 }
 function editPostBtnOnclicked(postobject){
   let post = JSON.parse(decodeURIComponent(postobject))
   console.log(post)
   document.getElementById("post-modal-submit-btn").innerHTML ="UPDATE"
   document.getElementById("post-id-input").value = post.id
   document.getElementById("post-modale-title").innerHTML = "EDIT POST"
   document.getElementById("post-title-input").value = post.title
   document.getElementById("post-body-input").value = post.body


   let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
   postModal.toggle()
 }

 function deletePostBtnOnclicked(postobject){
  let post = JSON.parse(decodeURIComponent(postobject))
  console.log(post)
 
  document.getElementById("delete-post-id-input").value = post.id
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-Modal"),{})
  postModal.toggle()

 }
 
function confirmPostDelete() {
  const token = localStorage.getItem("token")

 const postId =  document.getElementById("delete-post-id-input").value 

  const url = `${baseUrl}/posts/${postId}`

  const headers = {
    "Content-Type" : "multipart/form-data",
    "authorization": `Bearer ${token}`

  }
  axios.delete(url ,{
    headers : headers
  })
  .then((response)=>{
    const modal = document.getElementById("delete-post-Modal")
    const madalinstance = bootstrap.Modal.getInstance(modal)
     madalinstance.hide()
   
    showAlert ("the post has been deleted successfully" ,"success")
     
    getposts()
 

  }).catch((error) =>{
    const message = error.response.data.message
   showAlert (message ,"danger")

  })
}


 function addBtnClicked() {
  
    document.getElementById("post-modal-submit-btn").innerHTML ="CREATE"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modale-title").innerHTML = "CREAT A NEW POST"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
 
 
    let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
    postModal.toggle()
 }

 

 

