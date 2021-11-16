

  class IPDevice {
	var    netType; //In lanFragment and wanFragment, 0=lan 1=wan; 
	String chipType;
	String devType;
	String cpuType;
	String devName;
	String devMac;
	String devIp;
	String devNetMask;
	String devGateWay;
	String dhcpState;
	String version;
	var  httpPort;
	boolean bWifi = false;
	String remark1, remark2, remark3, remark4, remark5;
	String devReply;
	var  firstPort; //tifa old version, first port is P60

	    var HTTP_CMD_GET_POWER = 0;
	    var HTTP_CMD_SET_POWER = 1;
	    var HTTP_CMD_GET_POWER_NAME = 2;
	    var HTTP_CMD_GET_TEMPRETURE = 3;
	    var HTTP_CMD_GET_CURRENT = 4;
	    var HTTP_CMD_SET_POWER_CYCLE = 5;
	    var HTTP_CMD_SET_ALL_POWER = 6;
	    var HTTP_CMD_GET_SCHEDULE = 7;
	    var HTTP_CMD_DEL_SCHEDULE = 8;
	    var HTTP_CMD_SET_SCHEDULE1 = 9;
	    var HTTP_CMD_SET_SCHEDULE2 = 10;
	    var HTTP_CMD_SET_SCHEDULE3 = 11;
	    var HTTP_CMD_SET_SCHEDULE = 12;
	    var HTTP_CMD_GET_DI = 13;
	    var HTTP_CMD_GET_SPDI = 14;
	    var HTTP_CMD_GET_DO = 15;
	    var HTTP_CMD_SET_DI_ACT1 = 16;
	    var HTTP_CMD_SET_DI_ACT2 = 17;
	    var HTTP_CMD_SET_DI_ACT3 = 18;
	    var HTTP_CMD_SET_DI_ACT4 = 19;
	    var HTTP_CMD_SET_DI_REPEAT = 20;
	    var HTTP_CMD_SET_DI_MODE = 21;
	    var HTTP_CMD_SET_DI_FILTER = 22;
	    var HTTP_CMD_SET_DI_COUNT = 23;
	    var HTTP_CMD_SET_DI_METER1 = 24;
	    var HTTP_CMD_SET_DI_METER2 = 25;
	    var HTTP_CMD_SET_DO_PULSE_WIDTH = 26;
	    var HTTP_CMD_SET_DO = 27;
	    var HTTP_CMD_SET_SPDI = 28;

	    var RELAY_OFF = 0;
	    var RELAY_ON = 1;
	    var RELAY_CYCLE = 2;
	    var WAKE_ON_LAN = 3;
	    var SHUTDOWN_ON_LAN = 4;
	    var DO_ON = 5;
	    var DO_OFF = 6;


	  IPDevice() {
		netType = 0;
		chipType = "";
		devType = "IPDevice";
		cpuType = "";
		devName = "IPPower";
		devMac = "009290888888";
		devIp = "";
		devNetMask = "";
		devGateWay = "";
		dhcpState = "";
		httpPort = 80;
		version = "";
		bWifi = false;
		firstPort = 1;
		
	}

	 
	     IPDevice getDeviceType(mac) {
		
			IPDevice dev = new IPDevice();
			if(mac.length() != 12) {
				dev.devType = "IP DEVICE";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}
			String checkMac = mac.substring(0, 8);
			if(checkMac.equals("00925910")) {
				dev.devType = "IP POWER 9258PRO";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
				return dev;
			}
			
			checkMac = mac.substring(0, 6);
			
			if(checkMac.equals("009212")) {//TIFA
				dev.devType = "IP SENSOR 9212";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009258")) {
				dev.devType = "IP POWER 9258";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009250")) {
				dev.devType = "IP POWER 9258XX";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009255")) {
				dev.devType = "IP POWER 9255";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009256")) {
				dev.devType = "IP POWER 9255PRO";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009216")) {
				dev.devType = "IP SENSOR 9216";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009224")) {
				dev.devType = "IP POWER 9223K";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equals("009259")) {
				dev.devType = "IP POWER 9258DS";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equalsIgnoreCase("0092D0")) {
				dev.devType = "Power Meter";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}else if(checkMac.equalsIgnoreCase("0092D1")) {
				dev.devType = "IP PB PRO";
				dev.chipType = "TIFA";
				dev.cpuType = "TF331";
			}
			else if(checkMac.equals("009260")) {//IMAGIA
				dev.devType = "IP POWER 9258W";
				dev.chipType = "IMAGIA";
			}else if(checkMac.equals("009261")) {
				dev.devType = "IP POWER 9258HP";
				dev.chipType = "IMAGIA";
			}else if(checkMac.equals("009360")) {//IMAGIA_VIDEO
				dev.devType = "IP VIDEO 9360Q";
				dev.chipType = "IMAGIA_VIDEO";
			}else if(checkMac.equals("009310")) {
				dev.devType = "IP VIDEO 9310";
				dev.chipType = "IMAGIA_VIDEO";
			}else if(checkMac.equals("009361")) {
				dev.devType = "IP VIDEO 9360QW";
				dev.chipType = "IMAGIA_VIDEO";
			}
			else if(checkMac.equals("009290")) {//RALINK
				dev.devType = "IP POWER 9258W2";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("009295")) {
				dev.devType = "IP POWER 9255W";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("A4134E")) {
				dev.devType = "IP POWER 9820";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("009821")) {
				dev.devType = "IP POWER 9820";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("009219")) {
				dev.devType = "IP SENSOR 9219";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("009858")) {
				dev.devType = "IP POWER 9858";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("009820")) {
				dev.devType = "IP POWER 9820LITE";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}else if(checkMac.equals("007658")) {//MT7688
				dev.devType = "IP POWER MT9858";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";
			}else if(checkMac.equals("007650")) {
				dev.devType = "IP POWER MT9850";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";
			}else if(checkMac.equals("007621")) {
				//dev.devType = "IP POWER M9821";
                dev.devType = "IP POWER 9820NW";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";
			}else if(checkMac.equals("007620")) {
                dev.devType = "IP POWER 9820MT";
                dev.chipType = "RALINK";
                dev.cpuType = "MT7688";
            }
			else if(checkMac.equals("007622")) {
				//dev.devType = "IP POWER M9822";
                dev.devType = "IP POWER 9820LiteNW";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";
			}else if(checkMac.equals("007623")) {
				dev.devType = "IP POWER M9823GP";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";


			}else if(checkMac.equals("007624")) {
				dev.devType = "IP POWER M9823LT";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";

			}
			else if(checkMac.equals("007625")) {
				dev.devType = "IP POWER M9825";
				dev.chipType = "RALINK";
				dev.cpuType = "MT7688";
			}
            else if(checkMac.equals("007628")) {
                dev.devType = "IP POWER M9828";
                dev.chipType = "RALINK";
                dev.cpuType = "MT7688";
            }
            else if(checkMac.equals("007612")) {
                dev.devType = "IP POWER M9812";
                dev.chipType = "RALINK";
                dev.cpuType = "MT7688";
            }
            else if(checkMac.equals("007690")) {
                dev.devType = "IP POWER 9890";
                dev.chipType = "RALINK";
                dev.cpuType = "MT7688";
            }else if(checkMac.equals("007660")) {
                dev.devType = "IP POWER 9860MT";
                dev.chipType = "RALINK";
                dev.cpuType = "MT7688";
            }
			else if(checkMac.equals("009071")) {//DM355
				dev.devType = "IP KAMERA 9070";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009070")) {
				dev.devType = "IP KAMERA 9070CS";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009072")) {
				dev.devType = "IP KAMERA 9070IR";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009074")) {
				dev.devType = "IP KAMERA 9070IR-W";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009076")) {
				dev.devType = "IP KAMERA 9076";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009077")) {
				dev.devType = "IP KAMERA 9077";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009075")) {
				dev.devType = "IP KAMERA 9070CSWO";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009079")) {
				dev.devType = "IP KAMERA 9070NIR";
				dev.chipType = "DM355";
				dev.cpuType = "DM355";
			}else if(checkMac.equals("009999")) {  //MICO
				dev.devType = "CLOUD POWER";
				dev.chipType = "MICO";
			}else {
				dev.devType = "IP DEVICE";
				dev.chipType = "RALINK";
				dev.cpuType = "RT5350";
			}
			return dev;	
		}
	 
	   var getDevicePortNum() {
		var portNum = 1;
		if(devType.equalsIgnoreCase("IP POWER 9258W2") ||
				devType.equalsIgnoreCase("IP POWER 9858") ||
				devType.equalsIgnoreCase("IP POWER 9258") ||
				devType.equalsIgnoreCase("IP POWER 9258XX") ||
				devType.equalsIgnoreCase("IP POWER 9223K") ||			
				devType.equalsIgnoreCase("IP PB PRO") ||
				devType.equalsIgnoreCase("IP POWER 9258W") ||
				devType.equalsIgnoreCase("IP POWER MT9858") ||
				devType.equalsIgnoreCase("IP POWER MT9850") ||

				devType.equalsIgnoreCase("IP POWER M9823GP") ||
				devType.equalsIgnoreCase("IP POWER M9823LT") ||
				devType.equalsIgnoreCase("IP POWER M9825") ||
				devType.equalsIgnoreCase("IP POWER 9258HP") ) {//4 port
			portNum = 4;
		}else if(devType.equalsIgnoreCase("IP POWER 9255") ||
				devType.equalsIgnoreCase("IP POWER 9255PRO") ||
				devType.equalsIgnoreCase("IP POWER 9255W") ||
				devType.equalsIgnoreCase("CLOUD POWER")) {//1 port
			portNum = 1;
		}else if(devType.equalsIgnoreCase("IP POWER 9258DS") ||
				devType.equalsIgnoreCase("IP POWER 9258PRO") ||
				devType.equalsIgnoreCase("IP POWER 9820") ||
                devType.equalsIgnoreCase("IP POWER 9820MT") ||
				devType.equalsIgnoreCase("IP SENSOR 9219") ||
				devType.equalsIgnoreCase("IP POWER 9820Lite") ||
				devType.equalsIgnoreCase("IP POWER 9890") ||
				devType.equalsIgnoreCase("IP POWER 9820NW") ||
                devType.equalsIgnoreCase("IP POWER 9860MT") ||
				devType.equalsIgnoreCase("IP POWER 9820LiteNW")) {//8 port
			portNum = 8;
		}else if(devType.equalsIgnoreCase("IP POWER M9828") ||
                devType.equalsIgnoreCase("IP POWER M9812")) { //2 port
		    portNum = 2;
         }
			
		return portNum;
	}

	  boolean bSupportMqtt() {

		return cpuType.equalsIgnoreCase("MT7688");

	}

	   boolean canUseCnt() {
		 
		 String verStr, tmp;
		 float ver = 0;
		 if(version != null && !version.isEmpty()) {
			 verStr = version.toLowerCase(Locale.US);
			 var index = verStr.indexOf("_v");
			 if(index == -1) {//may be v4.04
				 index = verStr.indexOf("v");
				 if(index == -1) {
					 tmp = "";
				 }else {
					 tmp = verStr.substring(index+1);
				 }
			 }else {//may be 9258_v4.04
				 tmp = verStr.substring(index+2);
			 }
			 
			 try{
				 ver = Float.parseFloat(tmp);
			 }catch(NumberFormatException e) {
				 ver = 0;
			 }
					
		 }
		 if(chipType.equalsIgnoreCase("RALINK") ) {
			 return true;
		 }
		
		 if( devType.equalsIgnoreCase("IP POWER 9258") && 
			 (Float.floatToIntBits(ver) >= Float.floatToIntBits(4.04f)) ) {
			 return true;
		 }else if( (devType.equalsIgnoreCase("IP POWER 9255") || devType.equalsIgnoreCase("IP POWER 9255PRO"))
			&&  (Float.floatToIntBits(ver) >= Float.floatToIntBits(4.07f)) ) {
			 return true;
		 }
		 
		 return false;
	 }
	 
	   boolean canBeControlPower() {

		 //Ralink
//Tifa
//devType.equalsIgnoreCase("IP POWER 9212") || //no test
//no test
//devType.equalsIgnoreCase("IP PB PRO") || //no test
//Imagia
//MICO
		 return devType.equalsIgnoreCase("IP POWER 9258W2") || //Ralink
				 devType.equalsIgnoreCase("IP POWER 9255W") ||
				 devType.equalsIgnoreCase("IP POWER 9820") ||
                 devType.equalsIgnoreCase("IP POWER 9820MT") ||
				 devType.equalsIgnoreCase("IP POWER 9219") ||
				 devType.equalsIgnoreCase("IP POWER 9820LITE") ||
				 devType.equalsIgnoreCase("IP POWER 9858") ||
				 devType.equalsIgnoreCase("IP POWER MT9858") ||
				 devType.equalsIgnoreCase("IP POWER MT9850") ||
				 //devType.equalsIgnoreCase("IP POWER 9820") ||
				 devType.equalsIgnoreCase("IP POWER 9820LiteNW") ||
				 devType.equalsIgnoreCase("IP POWER M9823GP") ||
				 devType.equalsIgnoreCase("IP POWER M9823LT") ||
				 devType.equalsIgnoreCase("IP POWER M9825") ||
				 devType.equalsIgnoreCase("IP POWER M9828") ||
				 devType.equalsIgnoreCase("IP POWER M9812") ||
				 devType.equalsIgnoreCase("IP POWER 9890") ||
				 devType.equalsIgnoreCase("IP POWER 9820NW") ||
                 devType.equalsIgnoreCase("IP POWER 9860MT")||

				 devType.equalsIgnoreCase("IP POWER 9258") || //Tifa
				 devType.equalsIgnoreCase("IP POWER 9258DS") ||
				 devType.equalsIgnoreCase("IP POWER 9258PRO") ||
				 //devType.equalsIgnoreCase("IP POWER 9212") || //no test
				 devType.equalsIgnoreCase("IP POWER 9258XX") ||
				 devType.equalsIgnoreCase("IP POWER 9255") || //no test
				 devType.equalsIgnoreCase("IP POWER 9255PRO") ||
				 devType.equalsIgnoreCase("IP POWER 9223K") ||
				 //devType.equalsIgnoreCase("IP PB PRO") || //no test

				 devType.equalsIgnoreCase("IP POWER 9258W") || //Imagia
				 devType.equalsIgnoreCase("IP POWER 9258HP") ||
				 devType.equalsIgnoreCase("CLOUD POWER");
	}
	 
	   boolean canGetTempreture() {
		 //	devType.equalsIgnoreCase("IP POWER 9820") ||
		 return devType.equalsIgnoreCase("IP POWER 9258W2") ||
				 devType.equalsIgnoreCase("IP POWER 9255W") ||
				 devType.equalsIgnoreCase("IP POWER 9820") ||
                 devType.equalsIgnoreCase("IP POWER 9820MT") ||
				 //devType.equalsIgnoreCase("IP POWER 9820LITE") ||
				 devType.equalsIgnoreCase("IP POWER 9258XX") ||
				 devType.equalsIgnoreCase("IP POWER 9255PRO") ||
				 devType.equalsIgnoreCase("IP POWER 9820NW") ||
				 devType.equalsIgnoreCase("IP POWER M9823GP") ||
				 devType.equalsIgnoreCase("IP POWER M9828") ||
				 devType.equalsIgnoreCase("IP POWER M9812") ||
                 devType.equalsIgnoreCase("IP POWER 9860MT") ||
				 devType.equalsIgnoreCase("CLOUD POWER");
	}
	 
	   boolean canGetCurrent() {
		 return devType.equalsIgnoreCase("IP POWER 9258W2") ||
				 devType.equalsIgnoreCase("IP POWER 9255W") ||
				 devType.equalsIgnoreCase("IP POWER 9820") ||
                 devType.equalsIgnoreCase("IP POWER 9820MT") ||
				 devType.equalsIgnoreCase("IP POWER 9258XX") ||
				 devType.equalsIgnoreCase("IP POWER 9255PRO") ||
				 devType.equalsIgnoreCase("IP POWER 9219") ||
                 devType.equalsIgnoreCase("IP POWER 9820NW") ||
				 devType.equalsIgnoreCase("IP POWER M9828") ||
                 devType.equalsIgnoreCase("IP POWER 9860MT") ||
				 devType.equalsIgnoreCase("CLOUD POWER");
	}

	  boolean canGetPowerName() {
		return cpuType.equalsIgnoreCase("MT7688");
	}
	 
	  String getHttpCmdString(var http_cmd, String ip, String ctrlMsg) {
		String cmd = null;
		/*
		if(devType.equalsIgnoreCase("IP POWER 9258W2") || //Ralink
				devType.equalsIgnoreCase("IP POWER 9255W") ||
				devType.equalsIgnoreCase("IP POWER 9858") ||
				devType.equalsIgnoreCase("IP POWER 9820")) */
		
		if( chipType.equalsIgnoreCase("RALINK") ){
			if(http_cmd == HTTP_CMD_GET_POWER) {
				//hy 2016-12-9 cmd = String.format("http://%s/goform/getpower", ip);
				cmd = String.format("http://%s/set.cmd?cmd=getpower", ip);
			}else if(http_cmd == HTTP_CMD_GET_POWER_NAME) {
				cmd = String.format("http://%s/goform/getpowername", ip);
			}else if(http_cmd == HTTP_CMD_SET_POWER) {
				//cmd = String.format("http://%s/goform/setpower?%s", ip, ctrlMsg);  //case EOF exception
				cmd = String.format("http://%s/set.cmd?cmd=setpower&%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_GET_TEMPRETURE) {
				cmd = String.format("http://%s/set.cmd?cmd=gettemp", ip);
			}else if(http_cmd == HTTP_CMD_GET_CURRENT) {
				cmd = String.format("http://%s/set.cmd?cmd=getcurrent", ip);
			}else if(http_cmd == HTTP_CMD_SET_POWER_CYCLE) {
				cmd = String.format("http://%s/set.cmd?cmd=setpowercycle&%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_ALL_POWER) {
				cmd = String.format("http://%s/goform/setallpower?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_GET_SCHEDULE) {
				cmd = String.format("http://%s/goform/getschedule11", ip);
			}else if(http_cmd == HTTP_CMD_DEL_SCHEDULE) {
				cmd = String.format("http://%s/goform/delscheduleconfig?delschconfig=%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_SCHEDULE1) {
				cmd = String.format("http://%s/goform/scheduleconfig1?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_SCHEDULE2) {
				cmd = String.format("http://%s/goform/scheduleconfig2?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_SCHEDULE3) {
				cmd = String.format("http://%s/goform/scheduleconfig3?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_SCHEDULE) {
				cmd = String.format("http://%s/goform/setschedule?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_GET_DI) {
				cmd = String.format("http://%s/goform/getdi", ip);
			}else if(http_cmd == HTTP_CMD_GET_SPDI) {
				cmd = String.format("http://%s/goform/getdi", ip);
			}else if(http_cmd == HTTP_CMD_GET_DO) {
				cmd = String.format("http://%s/goform/getdo", ip);
			}else if(http_cmd == HTTP_CMD_SET_DI_ACT1) {
				cmd = String.format("http://%s/goform/sdiaction1?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_ACT2) {
				cmd = String.format("http://%s/goform/sdiaction2?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_ACT3) {
				cmd = String.format("http://%s/goform/sdiaction3?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_ACT4) {
				cmd = String.format("http://%s/goform/sdiaction4?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_REPEAT) {
				cmd = String.format("http://%s/goform/setrepeat?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_MODE) {
				cmd = String.format("http://%s/goform/setdimode?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_FILTER) {
				cmd = String.format("http://%s/goform/setfilter?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_COUNT) {
				cmd = String.format("http://%s/goform/setdicount?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_METER1) {
				cmd = String.format("http://%s/goform/setdimeter1?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DI_METER2) {
				cmd = String.format("http://%s/goform/setdimeter2?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DO_PULSE_WIDTH) {
				cmd = String.format("http://%s/goform/setperiod?%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_DO) {
				cmd = String.format("http://%s/set.cmd?cmd=setdo+%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_SET_SPDI) {
				cmd = String.format("http://%s/set.cmd?cmd=setdi+%s", ip, ctrlMsg);
			}
		
		}else if(chipType.equalsIgnoreCase("TIFA")) {
			if(http_cmd == HTTP_CMD_GET_POWER) {			
				cmd = String.format("http://%s/Set.cmd?CMD=GetPower", ip);				
			}else if(http_cmd == HTTP_CMD_SET_POWER) {
				cmd = String.format("http://%s/Set.cmd?CMD=SetPower+%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_GET_TEMPRETURE) {//only 9255pro
				cmd = String.format("http://%s/set.cmd?cmd=gettemperature", ip);
			}else if(http_cmd == HTTP_CMD_GET_CURRENT) {//only 9255pro
				cmd = String.format("http://%s/set.cmd?cmd=getcurrent", ip);
			}
			if( devType.equalsIgnoreCase("IP POWER 9258DS") ||
				devType.equalsIgnoreCase("IP POWER 9258PRO") ) {
				cmd = cmd.toLowerCase(Locale.US);
			}
			/*
		}else if(devExt.devType.equalsIgnoreCase("IP POWER 9258W")||//Imagia
				devExt.devType.equalsIgnoreCase("IP POWER 9258HP") ) {*/
		}else if(chipType.equalsIgnoreCase("IMAGIA")) {	
			if(http_cmd == HTTP_CMD_GET_POWER) {
				cmd = String.format("http://%s/GetPower.cgi", ip);
			}else if(http_cmd == HTTP_CMD_SET_POWER) {
				cmd = String.format("http://%s/SetPower.cgi?%s", ip, ctrlMsg);
			}
		}
		else if(chipType.equalsIgnoreCase("MICO")) {
			if(http_cmd == HTTP_CMD_GET_POWER) {
				cmd = String.format("http://%s/set.cmd?cmd=get_motor", ip);
			}else if(http_cmd == HTTP_CMD_SET_POWER) {
				cmd = String.format("http://%s/set.cmd?cmd=set_motor&%s", ip, ctrlMsg);
			}else if(http_cmd == HTTP_CMD_GET_TEMPRETURE) {
				cmd = String.format("http://%s/set.cmd?cmd=get_temp_hum", ip);
			}else if(http_cmd == HTTP_CMD_GET_CURRENT) {
				cmd = String.format("http://%s/set.cmd?cmd=get_infrared", ip);
			}
		}else {
			cmd = null;
		}
		
		return cmd;
	}

			
	  String getCtrlString(var port_index, var port_state) {	
		String ctrlMsg;
	
		 if(chipType.equalsIgnoreCase("IMAGIA")) {
			 //ctrlMsg = "p1=1";
			 ctrlMsg = String.format("p%d=%d", port_index, port_state);
		 }else if(chipType.equalsIgnoreCase("TIFA") && firstPort == 0) {
			 //ctrlMsg = "P60=1";	
			 ctrlMsg = String.format("P6%d=%d", port_index-1, port_state);
		 }else if(chipType.equalsIgnoreCase("MICO")) {
			 ctrlMsg = String.format("motor_on=%d", port_state);
		 }
		 else {
			 //ctrlMsg = "p61=1";	
			 ctrlMsg = String.format("p6%d=%d", port_index, port_state);
		 }
		 return ctrlMsg;	
	}
	
		
}



