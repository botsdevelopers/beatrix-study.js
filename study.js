const Discord = require("discord.js");
const User = require("../../schema/UserSchema");

const mongoose = require("mongoose");
const { mongourl } = require("../../config.js");


module.exports = {
  name: "study",
  description: "Helps for studying",

 execute: async (message, args, client, prefix) => {
   let words = args;
    if (words[0] === undefined) {
      const helpEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(
        "Beatrix • Study Cmds..",
        "https://cdn.discordapp.com/emojis/890086553794256906.gif"
      )
       .setDescription("** Welcome to Beatrix's Study help panel.\n\n See the list of study Cmds :**.")

        .addFields(
          {
            name: "`<a:BlueStar:887999877957705759> study-clockin`",
            value: "Star the study session with a timer",
          },
          {
            name: "`<a:BlueStar:887999877957705759> study-clockout`",
            value: "End the study session",
          },
          { name: "`<a:BlueStar:887999877957705759> study-total`", value: "See the total time you have studied today" }
        );
           .setThumbnail(client.user.displayAvatarURL())   
           .setFooter(client.user.username)
           .setTimestamp()

      message.channel.send({ embeds: [helpEmbed] });
    } else {
      switch (words[0].toUpperCase()) {
        case "HELP":
          const helpEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setThumbnail(client.user.displayAvatarURL())   
            .setAuthor(
        "Beatrix • Study Cmds..",
        "https://cdn.discordapp.com/emojis/890086553794256906.gif"
      )
            .setDescription("** Welcome to Beatrix's Study help panel.\n\n See the list of study Cmds :**.")

           .addFields(
              {
                name: "`<a:BlueStar:887999877957705759> study-clockin`",
                value: "Star the study session with a timer",
              },
              {
                name: "`<a:BlueStar:887999877957705759> study-clockout`",
                value: "End the study session",
              },
              {
                name: "`<a:BlueStar:887999877957705759> study-total`",
                value: "See the total time you have studied today",
              }
            );
           .setFooter(client.user.username)
           .setTimestamp()

          message.channel.send({ embeds: [helpEmbed] });
          break;
        case "CLOCKIN": //study-clockin
          clockIn(message);
          break;
        case "CLOCKOUT": //study-clockout
          clockOut(message);
          break;
        case "TOTAL": //study-total
          total(message);
          break;
        default:
          //message.channel.send('Unexpected arguments. Try using `.help` for more information.');
          const unexpectedArgumentsEmbed = new Discord.MessageEmbed()
            .setColor("#ff3300")
            .setTitle("Unexpected arguments")
            .setDescription("Try using `.help` for more information.");
          message.channel.send({ embeds: [unexpectedArgumentsEmbed] });
          break;
      }
    }
  },
};

function clockIn(message) {
  //Checks if the user exists.
  User.exists({ realuser: message.author.id, status: false }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);

      if (result === true) {
        //User exists, continue on with their stats.
        User.findOne({ realuser: message.author.id }, (err, doc) => {
          //Find the user and see if they already clocked in
          if (err) {
            console.log(err);
          } else {
            //Setup timer to 0 sec
            var d = new Date();
            var date = new Date(d.getTime());
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime =
              hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

            doc.timestart = d.getTime();
            doc.status = true;
            doc.save();

            const clockInEmbed = new Discord.MessageEmbed()
              
              .setAuthor(`Clock Started…`, "https://cdn.discordapp.com/emojis/891314360343998465.png")
             .setDescription(`<a:r2:886915489190805515> **<@${message.author.id}>, Successfully Started clock <3 **. `)
              .setColor("BLUE")
        
			.setFooter('By Beatrıx')
            message.channel.send({ embeds: [clockInEmbed] });
          }
        });
      } else {
        User.exists({ realuser: message.author.id }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            if (result === true) {
              // If it exists, it means the status is true. Which means it is clocked in.
              message.reply("User is already clocked in!");
            } else {
              //User does not exists, add a new user.

              //Setup timer to 0 sec
              var d = new Date();
              var date = new Date(d.getTime());
              var hours = date.getHours();
              var minutes = "0" + date.getMinutes();
              var seconds = "0" + date.getSeconds();
              var formattedTime =
                hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

const user = new User({
               realuser: message.author.id,
                timestart: d.getTime(),
                timetotal: 0.0,
                status: true,
              });
 
 
              user
                .save()
                .then((result) => console.log(result))
                .catch((err) => console.log(err));
setTimeout(() => {
await User.findOneAndDelete({realuser:message.author.id});
}, 24 * 60 * 60 * 1000);  
              

              const clockInEmbed = new Discord.MessageEmbed()
                .setAuthor(`Clock Started…`, "https://cdn.discordapp.com/emojis/891314360343998465.png")
		.setDescription(`<a:r2:886915489190805515> **<@${message.author.id}>, Successfully Started clock <3 **. `)
                .setColor("BLUE")
        
			.setFooter('By Beatrıx')
              message.channel.send({ embeds: [clockInEmbed] });
            }
          }
        });
      }
    }
  });
}

function clockOut(message) {
  //Checks if the user exists.
  User.exists({ realuser: message.author.id, status: true }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);

      if (result === true) {
        //User exists, continue on with their stats.
        User.findOne(
          { realuser: message.author.id, status: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              var d = new Date();
              var timeStudied = d.getTime() - doc.timestart;
              doc.timestart = 0;
              doc.timetotal = doc.timetotal + timeStudied;
              doc.status = false;
              doc.save();

              const clockOutEmbed = new Discord.MessageEmbed()
                .setColor("BLUE")
                
                .setAuthor(`Clock Stoped…`, "https://cdn.discordapp.com/emojis/891314360343998465.png")
                .setDescription(
                  "<a:r2:886915489190805515> **<@${message.author.id}>, Successfully ended clock <3 **."
                );
                .setFooter('By Beatrıx')
              message.channel.send({ embeds: [clockOutEmbed] });
            }
          }
        );
      } else {
        //They did not clocked in.
        message.reply(
          'You did not clock in! Please clock in using "!study clockin".'
        );
      }
    }
  });
}

function total(message) {
  User.exists({ realuser: message.author.id, status: false }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);

      if (result === true) {
        //User exists, continue on with their stats.
        User.findOne(
          { realuser: message.author.id, status: false },
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              const totalEmbed = new Discord.MessageEmbed()
                .setColor("#3480eb")
                .setTitle("Total Time")
                .setThumbnail(
                  "https://cdn.discordapp.com/attachments/802619145065594922/815433610621485086/33bs6c.png"
                )
                .setDescription(
                  "**<@${message.author.id}>, Your total time study Today is -**" +
                    (doc.timetotal / 3600000).toFixed(2) +
                    " min <3 ."
                );
              message.channel.send({ embeds: [totalEmbed] });
            }
          }
        );
      } else {
        message.reply(
          "You either not in the system or clocked in at the moment!"
        );
      }
    }
  });
}
