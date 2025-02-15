async function gitActivities(username) {
    const response =await fetch(`https://api.github.com/users/${username}/events`)

    if (!response.ok){
        if (response.status === 404){
            throw new Error("User not found");
        }else {
            throw new Error (`Error fetching data:${response.status}`);
        }
    }
    return response.json();

}


//Function for displaying activities
function handleEvents(events){
    if (events.length === 0){
        console.log("No activity Found");
        return;
    }
    events.forEach((event)=>{
        let message;
        switch (event.type){
            case "PushEvent":
                message= `Pushed ${event.payload.size} commits to ${event.repo.name}`;
                break;
                
            case "CreateEvent":
                message=`Created ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
                break;

            case "WatchEvent":
                message = `Starred ${event.repo.name}`;
                break;
            
            case "DeleteEvent":
                message = `Deleted ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
                break;

            default:
                message=`performed ${event.type} on ${event.repo.name}`;
        }
        console.log(`${event.actor.login}-${message}`);

    });
    
}

//cli logic
const username = process.argv[2];
if(!username){
    console.error("Provide a Git username.");
    process.exit (1);
}

gitActivities(username).then((events)=>{
    handleEvents(events);
}).catch((err)=>{
    console.error(err.message);
    process.exit(1);
});
