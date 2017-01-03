//Xavier's probe http_rtt app
var usefulInfoHolder = {
    providers : {
        'akamai' : '1.1.1.1',
        'aws' : '8.8.8.8',
        'cloudflare' : 'bar.foo.com'
    }
};

function init(config) {
    'use strict';
    var i;
    usefulInfoHolder.aliases = Object.keys(usefulInfoHolder.providers);
    usefulInfoHolder.aliasesLength = usefulInfoHolder.aliases.length;
    
    for (i = 0; i < usefulInfoHolder.aliasesLength; i += 1) {
        config.requireProvider(usefulInfoHolder.aliases[i]);
    }
}

function lowestRTT(rtt_info) {
    'use strict';
    var currentLowestRTT = Infinity,
        answer = null,
        theKeys = Object.keys(rtt_info),
        keysLength = theKeys.length,
        i,
        key,
        value;
    
    for (i = 0; i < keysLength; i += 1) {
        key = theKeys[i];
        value = rtt_info[key].http_rtt;
        if (value < currentLowestRTT) {
            answer = key;
            currentLowestRTT = value;
        }
    }
    return answer;
}

function onRequest(request, response) {
    'use strict';
    var rtt = request.getProbe('http_rtt'),
        choiceCDN = lowestRTT(rtt);
    if (choiceCDN !== null) {
        response.respond(choiceCDN, usefulInfoHolder.providers[choiceCDN]);
        response.setTTL(30);
    } else if (choiceCDN === null) {
        response.respond('aws', '2.4.6.8');
        response.setTTL(40);
    }
}
