var rowCount = document.getElementsByClassName("uiVirtualDataTable slds-table")[0].children[2].children.length
console.log("This: ", rowCount)
if(rowCount){
    fetch('http://localhost:3000/Notification')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}