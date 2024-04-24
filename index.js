let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")



const setupCamera = ()=>{
    navigator.mediaDevices.getUserMedia({
        video:{width:600,height:400},
        audio:false
    }).then(stream=>{
        video.srcObject = stream;
    })
}



const detectFace = async () => {
    const prediction = await model.estimateFaces(video, false);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.src = './face.png'; 

    prediction.forEach((pred) => {
        ctx.save(); // Save the current drawing state
        // Mirror the canvas horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "green";
        ctx.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0] - pred.topLeft[0],
            pred.bottomRight[1] - pred.topLeft[1]
        );
        ctx.stroke();

        ctx.fillStyle = "cyan";

        pred.landmarks.forEach((landmark, index) => {
            ctx.fillRect(landmark[0], landmark[1], 5, 5);
        });

        // Calculate image position and size based on face detection
        // const imageX = pred.topLeft[0] + (pred.bottomRight[0] - pred.topLeft[0]) / 2 - image.width / 2;
        // const imageY = pred.topLeft[1] + (pred.bottomRight[1] - pred.topLeft[1]) / 2 - image.height / 2;

        const imageWidth = (pred.bottomRight[0] - pred.topLeft[0]) * 1.1;
        const imageHeight =  image.height * (imageWidth / image.width); 
        const imageX = pred.topLeft[0] + (pred.bottomRight[0] - pred.topLeft[0]) / 2 - imageWidth / 2;
        const imageY = pred.topLeft[1] + (pred.bottomRight[1] - pred.topLeft[1]) / 2 - image.height / 2;
       
        // Draw the image on the canvas
        ctx.drawImage(image, imageX, imageY + 125, imageWidth, imageHeight);

        ctx.restore(); // Restore the original drawing state
    });
};
setupCamera()

video.addEventListener('loadeddata',async ()=>{
    model = await blazeface.load();
    setInterval(detectFace,10)
})