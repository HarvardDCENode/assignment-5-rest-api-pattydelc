// wrap in IIFE to control scope
(function(){

    const baseURL = 'http://localhost:8080'; 
 
    function testAPIs(){
        // test list first
        let testId = '';
        let testJSON = {};
    
        // list
        callAPI('GET', '/api/blogs', null, null)
            .then((list)=>{
                console.log('\n\n***************************\nlist results:');
                console.log(list);
                testId = list[0]._id;
            })
            .then(()=>{
                // create form data object with blog and metadata
                // This section is for uploading a file to the REST API
                let input = document.querySelector('input[type="file"]')
                let data = new FormData()
                data.append('title', 'My API Test Title');
                data.append('image', input.files[0]);
                data.append('blog', 'This is an AJAX API test');
                data.append('author', 'Tester');
                data.append('city', 'Test City');
                data.append('country', 'Test Country');
                data.append('date_of_travel', '2025-04-01');
        
                // create the POST call to the API
                callAPI('POST', '/api/blogs', null, data)
                .then((blog)=>{
                    console.log('\n\n***************************\ncreate results:');
                    console.log(blog);
                    return blog;
                })
                .then((blog)=>{
                    // find
                    return callAPI('GET','/api/blogs/'+blog._id, null, null)
                .then((blog)=>{
                    // output the result of the Promise returned by response.json()
                    console.log('\n\n***************************\nfind results:');
                    console.log(blog);
                    return blog;
                })
                .then((blog)=>{
                    // update description
                    blog.blog += ' appended by the AJAX API ';
                    return callAPI('PUT','/api/blogs/'+blog._id, null, blog)
                .then((blog)=>{
                    // output the result of the Promise returned by response.json()
                    console.log('\n\n***************************\nupdate results:');
                    console.log(blog);
                    return blog;
                })
                .then((blog)=>{
                    // now find again to confirm that the dedscription update was changed
                    return callAPI('GET','/api/blogs/'+blog._id, null, null)
                })
                .then((blog)=>{
                    // output the result of the Promise returned by response.json()
                    console.log('\n\n***************************\nfind results (should contain updated description field):');
                    console.log(blog);
                    return blog;
                })
                .then((blog)=>{
                    //delete
                    callAPI('DELETE', '/api/blogs/'+blog._id, null, null)
                        .then((result)=>{
                            console.log('\n\n***************************\ndelete result:');
                            console.log(result);
                        })
                });
            })
        })
        })
        .catch((err)=>{
            console.error(err);
        });
    
    
    
        async function callAPI(method, uri, params, body){
            jsonMimeType = {
                'Content-type':'application/json'
            }
            try{

                const response = await fetch(baseURL + uri, {
                    method: method, // GET, POST, PUT, DELETE, etc.
                    ...(method=='POST' ? {body: body} : {}),
                    ...(method=='PUT' ?  {headers: jsonMimeType, body:JSON.stringify(body)} : {})
                });
                return response.json(); 

            }catch(err){
            console.error(err);
                return "{'status':'error'}";
            }
        }
    }
 
   // Calls our test function when we click the button
   //  afer validating that there's a file selected.
   document.querySelector('#testme').addEventListener("click", ()=>{
        let input = document.querySelector('input[type="file"]')
        if (input.value){ 
            testAPIs();
        }else{
            alert("please select an image file first");
        }
   });
 })();