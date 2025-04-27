export async function GET(req,res,next) {

    let users=[
        {
            id:1,
            name:"Rabia",
            email:"rabiabatool455@gmail.com",
        },
        {
            id:1,
            name:"Aliya",
            email:"rabiabatool455@gmail.com", 
        },
    ];
    let data=JSON.stringify(users);
    return new Response(data);
    
}