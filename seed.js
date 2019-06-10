const mongoose = require('mongoose'),
    Camp = require("./models/camp"),
    Comment = require("./models/comment");
   
   
let data = [
        {
            name: "mumbai",
            image: "https://res.cloudinary.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/green-getaway-camps-kambre/_MG_2538_i3amch",
            description: "Hello" 
        },
        {
            name: "Chennai",
            image: "https://res.cloudinary.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/green-getaway-camps-kambre/_MG_2538_i3amch",
            description: "Hello" 
        },
        {
            name: "Kochi",
            image: "https://res.cloudinary.com/simplotel/image/upload/w_5000,h_3333/x_0,y_260,w_5000,h_2813,r_0,c_crop,q_60,fl_progressive/w_960,f_auto,c_fit/green-getaway-camps-kambre/_MG_2538_i3amch",
            description: "Hello" 
        }
     ] 
function seedDB() {
    Camp.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("removed camps");
            data.forEach(seed => {
                Camp.create(seed, (err, camp) => {
                    if(err) console.log(err);
                    else {
                        console.log("Added a camp");
                        Comment.create({
                            text: "This place is great",
                            author: "Rahul"
                        }, (err, comment) => {
                           if (err) {
                               console.log(err);
                           } else {
                                camp.comments.push(comment);
                                camp.save();
                                console.log("Created a comment");
                           }
                        })
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;