const {Queue} =require('bullmq')
const {RedisManager} = require('../../RedisConnection/RedisConnection')
const CompetitionNotification = new Queue('competitionnotificationqueue',{
    connection:RedisManager});

module.exports = CompetitionNotification;