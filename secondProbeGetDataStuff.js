//Xavier's first app
var providers = {
    'akamai' : '1.1.1.1',
    'aws' : '8.8.8.8',
    'cloudflare' :'bar.foo.com'
};

var aliases = Object.keys(providers);
var aliasesLength = aliases.length;

function init(config) {
    'use strict';
    for (var i = 0; i < aliasesLength; i += 1){
        config.requireProvider(aliases[i]);
    }
}

function lowestRTT(rtt_info) {
    'use strict';
    var currentLowestRTT = Infinity;
    var answer = null;
    var rtt_aliases = Object.keys(rtt_info);
    for (var i = 0; i< rtt_aliases.length; i += 1) {
        var rtt_alias_now = rtt_info[rtt_aliases[i]];
        var rtt_alias_now_number = rtt_alias_now.http_rtt;
        if (currentLowestRTT > rtt_alias_now_number){
            answer = rtt_alias_now;
            currentLowestRTT = rtt_alias_now_number;         
        }
    }
    return answer;
}

function onRequest(request, response) {
    'use strict';
    var rtt = request.getProbe('http_rtt');
    var choiceCDN = lowestRTT(rtt);
    response.setTTL(60);
    if (choiceCDN !== null){
        response.respond(choiceCDN, providers[choiceCDN]);
        providers[choiceCDN]();
    } else if (choiceCDN === null) {
        response.respond('aws_ec2_us_east_va', '2.4.6.8');
        response.setTTL(40);
    }
}
