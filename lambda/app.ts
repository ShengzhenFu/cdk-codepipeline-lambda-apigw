exports.handler=async (event: any)=>{
    console.log("starting lambda ...");
    const lambda_event=JSON.stringify(event, null, 2);
    console.log("lambda event: "+lambda_event);
    const bodys= {
        "hello": `request path is ${event.path}`,
        "hi": `request method is ${event.httpMethod}`
    };
    const get_response = {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bodys)
    };
    return get_response;
}