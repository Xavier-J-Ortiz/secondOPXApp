//Xavier's first app
function init(config) {
    // useless for the time being
    'use strict';
    config.requireProvider('akamai_object_delivery');
    config.requireProvider('aws_ec2_us_east_va');
    config.requireProvider('cloudflare_cdn');
}

function lowestRTT(rtt_info) {
    'use strict';
    var aliases = Object.keys(rtt_info);
    var aliasesLength = aliases.length;
    var currentLowestRTT = Infinity;
    var answer = null;
    for (var i = 0; i< aliasesLength; i += 1) {
        if (currentLowestRTT > rtt_info[aliases[i]].http_rtt){
            answer = aliases[i];
            currentLowestRTT = rtt_info[aliase[i]].http_rtt;            
        }
    }
    return answer;
}

function onRequest(request, response) {
    'use strict';
    //looking for rtt of the providers stated above in init.
    var rtt = request.getProbe('http_rtt');
    var choiceCDN = lowestRTT(rtt);
    if (choiceCDN == 'akamai_object_delivery') {
        response.setProvider('akamai_object_delivery');
        // response.respond('akamai_object_delivery', '4.4.4.4');
        response.addARecord('1.1.1.1');
        response.addARecord('2.2.2.2');
        response.addARecord('3.3.3.3');
        response.addARecord('4.4.4.4');
        response.setTTL(20);
    } else if (choiceCDN == 'aws_ec2_us_east_va') {
        // why is specifying the provider alias important?
        response.respond('aws_ec2_us_east_va', '8.8.8.8');
        response.setTTL(30);
    } else if (choiceCDN == 'cloudflare_cdn') {
        //response.respond('akamai_object_delivery', '8.8.4.4');
        //response.setTTL(20);
        response.setProvider('cloudflare_cdn');
        response.addCName('bar.foo.com');
        response.setTTL(25);
    } else if (choiceCDN == null) {
        response.respond('aws_ec2_us_east_va', '2.4.6.8');
        response.setTTL(40);
    }
}