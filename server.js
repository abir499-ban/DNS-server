const dgram = require('node:dgram')
const dnsPacket = require('dns-packet')
const server = dgram.createSocket('udp4')

const db = {
    'username.com' : {
        type : 'A',
        ip : '75.75.43.43'
    },
    "blog.username.com" : {
        type: 'CNAME',
        ip : '43.21.2.1'
    }
}

server.on('message', (msg, remoteInfo)=>{
    // console.log(msg.toString());      
    // console.log(remoteInfo);
    const incomingReq  = dnsPacket.decode(msg);
    const domainName = incomingReq.questions[0].name;
    const DatafromDb = db[domainName]
    const ans = dnsPacket.encode({
        type:'response',
        id : incomingReq.id,
        flags : dnsPacket.AUTHORITATIVE_ANSWER,
        questions : incomingReq.questions,
        answers:[{
            type: DatafromDb.type,
            name: domainName,
            data: DatafromDb.ip,
        }]
    })
    server.send(ans, remoteInfo.port, remoteInfo.address)
})


server.bind(53, ()=>{
    console.log('Server is running on port: 53');
})