if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://triplehigh:Gr34tc0llapse@ds233300-a0.mlab.com:33300,ds233300-a1.mlab.com:33300/fulcrum-prod?replicaSet=rs-ds233300'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/fulcrum-dev'}
}