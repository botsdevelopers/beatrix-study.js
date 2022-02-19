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
        .setColor("#c542f5")
        .setTitle("!study help")
        .addFields(
          {
            name: "`!study help`",
            value: "display all commands in the `study` family",
          },
          {
            name: "`!study clockin`",
            value: "start a tracked study session",
          },
          {
            name: "`!study clockout`",
            value: "end a tracked study session",
          },
          // {
          //   name: "`!study leaderboard`",
          //   value: "display a leaderboard of those with the most study time",
          // },
          { name: "`!study total`", value: "display your total study time" }
        );

      message.channel.send({ embeds: [helpEmbed] });
    } else {
      switch (words[0].toUpperCase()) {
        case "HELP":
          const helpEmbed = new Discord.MessageEmbed()
            .setColor("#c542f5")
            .setTitle("!study help")
            .addFields(
              {
                name: "`!study help`",
                value: "display all commands in the `study` family",
              },
              {
                name: "`!study clockin`",
                value: "start a tracked study session",
              },
              {
                name: "`!study clockout`",
                value: "end a tracked study session",
              },
              // {
              //   name: "`!study leaderboard`",
              //   value:
              //     "display a leaderboard of those with the most study time",
              // },
              {
                name: "`!study total`",
                value: "display your total study time",
              }
            );

          message.channel.send({ embeds: [helpEmbed] });
          break;
        case "CLOCKIN": //!study clockin
          clockIn(message);
          break;
        case "CLOCKOUT": //!study clockout
          clockOut(message);
          break;
        case "LEADERBOARD": //!study leaderboard
          leaderboard(message, client);
          break;
        case "TOTAL": //!study total
          total(message);
          break;
        default:
          //message.channel.send('Unexpected arguments. Try using `!study help` for more information.');
          const unexpectedArgumentsEmbed = new Discord.MessageEmbed()
            .setColor("#ff3300")
            .setTitle("Unexpected arguments")
            .setDescription("Try using `!study help` for more information.");
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
              .setColor("#ff3300")
              .setTitle("Clocked in!")
              .setThumbnail(
                "https://static.displate.com/avatars/2021-03-22/95249c955be3cf912a337b55529728f2_e53e2117012a41b375c836bcc9e4713a.jpg"
              )
              .setDescription("User clocked in! Start time: " + formattedTime);
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
                .setColor("#ff3300")
                .setTitle("User added and Clocked in!")
                .setThumbnail(
                  "https://d1x26sjkwh9vok.cloudfront.net/uploads/profile/20210318/6d4b2890-31a2-4ce1-b600-7f17a7ed555d.png"
                )
                .setDescription(
                  "User added and clocked in! Start time: " + formattedTime
                );
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
                .setColor("#34eb8c")
                .setTitle("Clock Out!")
                .setThumbnail(
                  "https://media.istockphoto.com/vectors/cute-cat-waving-paw-cartoon-vector-illustration-vector-id1218481548?k=6&m=1218481548&s=612x612&w=0&h=bBHT3-dQ7YxYpkvrYaB6xFewMCx-pN5VLX2dsgE1KiM="
                )
                .setDescription(
                  "Clocked Out! You studied for " +
                    (timeStudied / 3600000).toFixed(2) +
                    " hours."
                );
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
                  "Total study time is " +
                    (doc.timetotal / 3600000).toFixed(2) +
                    " hours."
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
