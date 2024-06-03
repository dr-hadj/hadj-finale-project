const baseUrl = "https://tarmeezacademy.com/api/v1"


///posts request
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
 toggleloader(true)
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
}).finally(()=>{
  toggleloader(false)
})
getposts()

 
}
function profileClicked(){
  const user =  getCurrentUser()
  const userId = user.id
  
  window.location =`profile.html?userid=${userId}`
}

function  setupUI(){
    const token = localStorage.getItem("token")
   const logindiv = document.getElementById("logged-in-div")
   
   const logoutdiv  = document.getElementById("logout-div")
 
 
   const addBtn = document.getElementById("add-btn")
 
    if (token == null)  //user is guest
    {
     if(addBtn != null){
        addBtn.style.setProperty("display","none","important")
     }
     
     logindiv .style.setProperty("display","flex","important")
     logoutdiv.style.setProperty("display","none","important")
 
    }else{//for logged in user
        if(addBtn != null){
            addBtn.style.setProperty("display","block","important")
         }
     
     logindiv .style.setProperty("display","none","important")
     logoutdiv.style.setProperty("display","flex","important")
     const user =  getCurrentUser()
     document.getElementById("nav-username").innerHTML = user.username
     document.getElementById("nav-user-image").src = user.profile_image
    }
  }


//====auth functions ============
function loginbtnclicked(){
    const username = document.getElementById("username-input").value
     const password = document.getElementById("password-input").value
     const params = {
       "username" :username ,
       "password" : password
  
     }
     const url = `${baseUrl}/login`
      toggleloader(true)
     axios.post(url,params)
     .then((response)=>{
     
       localStorage.setItem("token",response.data.token)
       localStorage.setItem("user", JSON.stringify(response.data.user))
      const modal = document.getElementById("login-Modal")
      const madalinstance = bootstrap.Modal.getInstance(modal)
       madalinstance.hide()
       showAlert ("lougged in successfully","success")
       setupUI()
  
     }).catch((error) =>{
      const message = error.response.data.message
      showAlert (message ,"danger")
    }).finally(()=>{
      toggleloader(false)
    })
    getposts()
   }

   function toggleloader(show = true){
    if(show){
 
     document.getElementById("loader").style.visibility = 'visible'
    }else{
     document.getElementById("loader").style.visibility = 'hidden'
    }
  }




function rejesterbtnclicked(){
    const name = document.getElementById("rejester-name-input").value
     const username = document.getElementById("rejester-username-input").value
     const password = document.getElementById("rejester-password-input").value
     const image = document.getElementById("rejester-image-input").files[0]
   
  
     let formeData = new FormData()
     formeData.append("name",name)
     formeData.append("username",username)
     formeData.append("password",password)
     formeData.append("image",image)
     
     
     //toggleloade(true)
     const headers = {
       "Content-Type" : "multipart/form-data",
       
  
     }
     
     const url = `${baseUrl}/register`
    
     axios.post(url,formeData,{
       headers : headers
     })
     .then((response)=>{
      
       console.log(response.data)
       localStorage.setItem("token",response.data.token)
       localStorage.setItem("user", JSON.stringify(response.data.user))
      const modal = document.getElementById("rejester-Modal")
      const madalinstance = bootstrap.Modal.getInstance(modal)
       madalinstance.hide()
       showAlert ("NEW USER REGISTERED SUCCESSFULLY" ,"success")
       setupUI()
  
    
   }).catch((error) =>{
     const message = error.response.data.message
     showAlert (message ,"danger")
   }).finally(()=>{
    toggleloader(false)
  })
  getposts()
  }
  
function logout (){
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert ("lougged out successfully" ,"success")
    setupUI()
   document.getElementById("posts").innerHTML = ""
   document.getElementById("hide").innerHTML = ""
  
 }

function showAlert (customessage , type){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)
  }
  
  
      appendAlert(customessage, type)
  
      //hide the alert
     /* setTimeout(()=>{
        const alerton = bootstrap.Alert.getOrCreateInstance('#success-alert')
        alerton.close()
      },2000)*/
       
  }
  
function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null){
      user = JSON.parse(storageUser)
    }
    return user
  }
  