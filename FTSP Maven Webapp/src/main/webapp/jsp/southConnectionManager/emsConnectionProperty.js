/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
var gateWayNeId = 0;
var factory;
var emsGroupId ;
var connectypeStore = [ [ '1', 'CORBA' ], [ '2', 'TELNET' ] ];
var store_connectype = new Ext.data.ArrayStore({
	fields : [ {
		name : 'value'
	}, {
		name : 'displayName'
	} ]
});
store_connectype.loadData(connectypeStore);

var store = new Ext.data.ArrayStore({
	fields : [ {name:'id',mapping:'key'}, {name:'corbaType',mapping:'value'} ],
	data:NMS_TYPE
});

//var connectGroupStore = new Ext.data.Store({
//	url : 'connection!getEmsConnectGroup.action',
//	baseParams : {
//		"emsGroupId" : "-1"
//	},
//	reader : new Ext.data.JsonReader({
//		totalProperty : 'total',
//		root : "rows"
//	}, [ "GROUP_NAME", "BASE_EMS_GROUP_ID" ])
//});
//
//connectGroupStore.load({
//	callback : function(r, options, success) {
//		if (success) {
//
//		} else {
//			Ext.Msg.alert('错误', '网管分组查询失败！请重新查询');
//		}
//	}
//});

/**
 * 创建网管分组数据源
 */
var emsGroupStore = new Ext.data.Store({
	// 获取数据源地址
	proxy: new Ext.data.HttpProxy({// 如果请求没有参数，则把url定义在proxy属性里，并接设置disableCaching: false，
		url : 'common!getAllEmsGroups.action', // 否则会默认传一个_dc的参数，后台报错，除非在后台给_dc加上set方法
		disableCaching: false// 是否禁用缓存，设置false禁用默认的参数_dc
	}),
	baseParams : {"displayAll" : false,"displayNone" : true},
	// record格式
	reader : new Ext.data.JsonReader({
		root : 'rows',//json数据的key值
		fields :['BASE_EMS_GROUP_ID','GROUP_NAME']
	})
});
// 访问地址，加载数据(如果没有这一句，则不会去后台查询)
emsGroupStore.load({
	// 回调函数
	callback : function(records,options,success){// records：加载的数据数组 ，options:调用load方法的配置对象 ，success: 布尔值，是否加载成功
//		// 获取下拉框的第一条记录
//		var firstValue = records[0].get('BASE_EMS_GROUP_ID');
//		// 设置下拉框默认值(这里直接设记录的BASE_EMS_GROUP_ID值，自动会显示和BASE_EMS_GROUP_ID对应的GROUP_NAME)
//		Ext.getCmp('emsGroupCombo').setValue(firstValue);
	}
});

var svcStore = new Ext.data.Store({
	url : 'connection!getConnectService.action',
	baseParams : {
		"emsGroupId" : "-1"
	},
	reader : new Ext.data.JsonReader({
		totalProperty : 'total',
		root : "rows"
	}, [ "SYS_SVC_RECORD_ID", "SERVICE_NAME" ])
});

svcStore.load({
	callback : function(r, options, success) {
		if (success) {

		} else {
			Ext.Msg.alert('错误', '接入服务器查询失败！请重新查询');
		}
	}
});

var connectype = {
	xtype : 'combo',
	id : 'connectype',
	name : 'connectype',
	fieldLabel : '接口类型',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	store : connectypeStore,
	displayField : "connectypeName",
	valueField : 'connecTypeId',
	triggerAction : 'all',
	anchor : '35%',
	listeners : {
		select : function(combo, record, index) {
			if (this.getValue() == "1") {
				frontPanelCobar.setVisible(true);
				frontPanelTelnet.setVisible(false);
			} else if (this.getValue() == "2") {
				frontPanelTelnet.setVisible(true);
				frontPanelCobar.setVisible(false);
			}
		}
	}
};

// 网管分组
var corbaEmsGroup = new Ext.form.ComboBox({
	id : 'corbaEmsGroup',
	name : 'corbaEmsGroup',
	fieldLabel : '网管分组',

	valueField : 'BASE_EMS_GROUP_ID',// 下拉框实际值
	displayField : 'GROUP_NAME',// 下拉框显示值
//	sideText : '<font color=red>*</font>',
	editable : false,
	emptyText : "请选择网管所属分组",
	store : emsGroupStore,
	allowBlank : false,
	triggerAction : 'all',
	resizable: true,
	anchor : '35%'
});

// 网管分组
var telnetEmsGroup = new Ext.form.ComboBox({
	id : 'telnetEmsGroup',
	name : 'telnetEmsGroup',
	fieldLabel : '网管分组',
	valueField : 'BASE_EMS_GROUP_ID',// 下拉框实际值
	displayField : 'GROUP_NAME',// 下拉框显示值
//	sideText : '<font color=red>*</font>',
	editable : false,
	emptyText : "请选择网管所属分组",
	store : emsGroupStore,
	allowBlank : false,
	triggerAction : 'all',
	resizable: true,
	anchor : '35%'
});

var corbaEmsName = new Ext.form.TextField({
	id : 'corbaEmsName',
	name : 'corbaEmsName',
	fieldLabel : '网管名称',
	emptyText : '请输入网络的友好名称',
	allowBlank : false,
	blankText : '客户简称不能为空',
//	sideText : '<font color=red>*</font>',
	maxLength : 30,
	anchor : '35%'
// ,listeners : {
// blur : function(t) {
// var param = {
// 'emsConnectionModel.emsDisplayName' : t.getValue(),
// 'emsConnectionModel.emsGroupId' : Ext.getCmp("corbaEmsGroup")
// .getValue()
// };
// Ext.Ajax.request({
// url : 'connection!checkConnectionNameExist.action',
// method : 'POST',
// params : param,
// success : function(response) {
// var result = Ext.util.JSON.decode(response.responseText);
// if (result) {
// if (0 == result.returnResult) {
// Ext.MessageBox.show({
// title : '信息',
// width : 350,
// height : 45,
// msg : '同一网管分组下有相同的网管名称。名称不可重复。请修改！',
// buttons : Ext.MessageBox.OK,
// icon : Ext.MessageBox.alert
// });
// }
// }
// }
// });
// }
// }
});

var telnetEmsName = new Ext.form.TextField({
	id : 'telnetEmsName',
	name : 'telnetEmsName',
	fieldLabel : '网管名称',
	emptyText : '请输入网络的友好名称',
	allowBlank : false,
	blankText : '客户简称不能为空',
//	sideText : '<font color=red>*</font>',
	maxLength : 30,
	anchor : '35%'
// ,listeners : {
// blur : function(t) {
//
// var param = {
// 'emsConnectionModel.emsDisplayName' : t.getValue(),
// 'emsConnectionModel.emsGroupId' : Ext.getCmp("telnetEmsGroup")
// .getValue()
// };
// Ext.Ajax.request({
// url : 'connection!checkConnectionNameExist.action',
// method : 'POST',
// params : param,
// success : function(response) {
// var result = Ext.util.JSON.decode(response.responseText);
// if (result) {
// if (0 == result.returnResult) {
// Ext.MessageBox.show({
// title : '信息',
// width : 350,
// height : 45,
// msg : '同一网管分组下有相同的网管名称。名称不可重复。请修改！',
// buttons : Ext.MessageBox.OK,
// icon : Ext.MessageBox.alert
// });
// }
// }
// }
// });
// }
// }
});

// 网管类型
var corbaType = new Ext.form.ComboBox({
	id : 'corbaType',
	name : 'corbaType',
	fieldLabel : '网管类型',
	displayField : "corbaType",
//	sideText : '<font color=red>*</font>',
	selectOnFoucs : true,
	mode : "local",
	valueField : 'id',
	emptyText : "请选择网管类型",
	editable : false,
	store : store,
	allowBlank : false,
	triggerAction : 'all',
	anchor : '35%',
	listeners : {
		select : function(combo, record, index) {
			if (corbaType.getValue() == 11) {
				corbaPort.setValue("12001");
				emsName.setValue("Huawei/T2000");
				internalEmsName.setValue("Huawei/T2000");
				//factory = 1;
			} else if (corbaType.getValue() == 12) {
				corbaPort.setValue("12001");
				emsName.setValue("Huawei/U2000");
				internalEmsName.setValue("Huawei/U2000");
				//factory = 1;
			} else if (corbaType.getValue() == 21) {
				corbaPort.setValue("6001");
				emsName.setValue("ZTE/E300");
				internalEmsName.setValue("ZTE/1");
				//factory = 2;
			} else if (corbaType.getValue() == 22) {
				corbaPort.setValue("21176");
				emsName.setValue("ZTE/T3");
				internalEmsName.setValue("ZTE/T3");
				//factory = 2;
			} else if (corbaType.getValue() == 31) {
				corbaPort.setValue("55075");
				emsName.setValue("Lucent/");
				internalEmsName.setValue("Lucent/");
				//factory = 3;
			} else if (corbaType.getValue() == 41) {
				corbaPort.setValue("3075");
				emsName.setValue("FiberHome/OTNM2000");
				internalEmsName.setValue("FiberHome/OTNM2000");
				//factory = 4;
			} else if (corbaType.getValue() == 51) {
				corbaPort.setValue("5017");
				emsName.setValue("ALU/");
				internalEmsName.setValue("ALU/");
				//factory = 5;
			}
			factory = Math.floor(corbaType.getValue()/10);
		}
	}
});

// 网管类型
var telnetType = new Ext.form.ComboBox({
	id : 'telnetType',
	name : 'telnetType',
	fieldLabel : '网管类型',
	displayField : "telnetType",
//	sideText : '<font color=red>*</font>',
	selectOnFoucs : true,
	mode : "local",
	valueField : 'id',
	emptyText : "请选择网管类型",
	editable : false,
	store : new Ext.data.ArrayStore({
		id : 0,
		fields : [ 'id', 'telnetType' ],
		data : [ [ '91', '富士通' ] ]
	}),

	allowBlank : false,
	triggerAction : 'all',
	anchor : '35%',
	listeners : {
		select : function(combo, record, index) {
			if (telnetType.getValue() == 91) {
				telnetPort.setValue("2024");
				factory = 9;
			}
		}
	}
});

// 接入服务器
var corbaConnectServer = new Ext.form.ComboBox({
	id : 'corbaConnectServer',
	name : 'corbaConnectServer',
	fieldLabel : '接入服务器',
	displayField : "SERVICE_NAME",
	valueField : 'SYS_SVC_RECORD_ID',
//	sideText : '<font color=red>*</font>',
	selectOnFoucs : true,
	mode : "local",
	emptyText : "请选择网管所属接入服务器",
	editable : false,
	store : svcStore,
	allowBlank : false,
	triggerAction : 'all',
	resizable: true,
	anchor : '35%'
});

var telnetConnectServer = new Ext.form.ComboBox({
	id : 'telnetConnectServer',
	name : 'telnetConnectServer',
	fieldLabel : '接入服务器',
	displayField : "SERVICE_NAME",
	valueField : 'SYS_SVC_RECORD_ID',
//	sideText : '<font color=red>*</font>',
	selectOnFoucs : true,
	mode : "local",
	emptyText : "请选择网管所属接入服务器",
	editable : false,
	store : svcStore,
	allowBlank : false,
	triggerAction : 'all',
	resizable: true,
	anchor : '35%'
});

var corbaModeItems = [ {
	boxLabel : '自动',
	id : 'corbaModeAuto',
	name : 'corbaMode',
	value : 0,
	checked : true
}, {
	boxLabel : '手动',
	id : 'corbaModeManual',
	name : 'corbaMode',
	value : 1
} ];

// 连接模式
var corbaMode = new Ext.form.RadioGroup({
	id : 'corbaMode',
	name : 'corbaMode',
	fieldLabel : '连接模式',
	inputType : 'radio',
	items : corbaModeItems,
	allowBlank : false,
	anchor : '35%',
	listeners : {
		change : function(rd, va) {
			// alert(va.value);
		}
	}
});

var telnetModeItems = [ {
	boxLabel : '自动',
	id : 'telnetModeAuto',
	name : 'telnetMode',
	value : 0,
	checked : true
}, {
	boxLabel : '手动',
	id : 'telnetModeManual',
	name : 'telnetMode',
	value : 1
} ];

var telnetMode = new Ext.form.RadioGroup({
	id : 'telnetMode',
	name : 'telnetMode',
	fieldLabel : '连接模式',
	inputType : 'radio',
	items : telnetModeItems,
	allowBlank : false,
	anchor : '35%',
	listeners : {
		change : function(rd, va) {
			// alert(va.value);
		}
	}
});

// Ip地址
var corbaIpAddress = new Ext.form.TextField(
		{
			xtype : 'textfield',
			id : 'corbaIpAddress',
			name : 'corbaIpAddress',
			fieldLabel : 'IP地址',
			emptyText : '请输入连接IP地址........',
//			sideText : '<font color=red>*</font>',
			regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
			allowBlank : false,
			anchor : '35%'
		// ,listeners : {
		// blur : function(t) {
		// var param = {
		// 'emsConnectionModel.ip' : t.getValue()
		// };
		// Ext.Ajax.request({
		// url : 'connection!checkIpAddressExist.action',
		// method : 'POST',
		// params : param,
		// success : function(response) {
		// var result = Ext.util.JSON
		// .decode(response.responseText);
		// if (result) {
		// if (0 == result.returnResult) {
		// Ext.MessageBox.show({
		// title : '信息',
		// width : 350,
		// height : 45,
		// msg : '该IP地址已经存在。请填写新的IP地址！',
		// buttons : Ext.MessageBox.OK,
		// icon : Ext.MessageBox.alert
		// });
		// }
		// }
		// }
		// });
		// }
		// }
		});

// Ip地址
var telnetIpAddress = new Ext.form.TextField(
		{
			xtype : 'textfield',
			id : 'telnetIpAddress',
			name : 'telnetIpAddress',
			fieldLabel : 'IP地址',
			emptyText : '请输入连接IP地址........',
//			sideText : '<font color=red>*</font>',
			regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
			allowBlank : false,
			anchor : '35%'
		// ,listeners : {
		// blur : function(t) {
		// var param = {
		// 'emsConnectionModel.ip' : t.getValue()
		// };
		// Ext.Ajax.request({
		// url : 'connection!checkIpAddressExist.action',
		// method : 'POST',
		// params : param,
		// success : function(response) {
		// var result = Ext.util.JSON
		// .decode(response.responseText);
		// if (result) {
		// if (0 == result.returnResult) {
		// Ext.MessageBox.show({
		// title : '信息',
		// width : 350,
		// height : 45,
		// msg : '该IP地址已经存在。请填写新的IP地址！',
		// buttons : Ext.MessageBox.OK,
		// icon : Ext.MessageBox.alert
		// });
		// }
		// }
		// }
		// });
		// }
		// }
		});

var corbaPort = new Ext.form.NumberField({
	id : 'corbaPort',
	name : 'corbaPort',
	fieldLabel : '端口号',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 30,
	anchor : '35%'
});

var telnetPort = new Ext.form.NumberField({
	id : 'telnetPort',
	name : 'telnetPort',
	fieldLabel : '端口号',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 30,
	anchor : '35%'
});

var emsName = new Ext.form.TextField({
	id : 'emsName',
	name : 'emsName',
	fieldLabel : 'EMS Name',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 40,
	anchor : '35%'
});

var internalEmsName = new Ext.form.TextField({
	id : 'internalEmsName',
	name : 'internalEmsName',
	fieldLabel : '内部EMS Name',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 40,
	anchor : '35%'
});

var userName = new Ext.form.TextField({
	xtype : 'textfield',
	id : 'userName',
	name : 'userName',
	fieldLabel : '用户名',
	emptyText : '请输入通过CORBA连接用户名',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 30,
	anchor : '35%'
});

var password = new Ext.form.TextField({
	xtype : 'textfield',
	id : 'password',
	name : 'password',
	inputType : 'password',
	fieldLabel : '密  码',
	emptyText : '请输入通过CORBA连接的密码',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	maxLength : 30,
	anchor : '35%'
});

var encode = new Ext.form.ComboBox({
	id : 'encode',
	name : 'encode',
	fieldLabel : '编码格式',
	displayField : "encode",
	selectOnFoucs : true,
	mode : "local",
	valueField : 'encode',
	emptyText : "编码格式",
//	sideText : '<font color=red>*</font>',
	editable : false,
	allowBlank : false,
	store : new Ext.data.ArrayStore({
		id : 0,
		fields : [ 'encodeId', 'encode' ],
		data : [ [ 1, 'ISO-8859-1' ], [ 2, 'GBK' ], [ 3, 'UTF-8' ] ]
	}),
	allowBlank : false,
	triggerAction : 'all',
	anchor : '35%'
});

var corbaIntervalTime = new Ext.form.NumberField({
	id : 'corbaIntervalTime',
	name : 'corbaIntervalTime',
	fieldLabel : '命令间隔时间',
	emptyText : '默认1秒，输入值>=1，小于300',
	allowBlank : true,
	allowDecimals : false,
	allowNegative : false,
	minLength : 1,
	maxLength : 3,
	minValue : 1,
	maxValue : 299,
	anchor : '35%'
});

var telnetIntervalTime = new Ext.form.NumberField({
	id : 'telnetIntervalTime',
	name : 'telnetIntervalTime',
	fieldLabel : '命令间隔时间',
	emptyText : '默认1秒，输入值>=1，小于300',
	allowBlank : true,
	allowDecimals : false,
	allowNegative : false,
	minLength : 1,
	maxLength : 3,
	minValue : 1,
	maxValue : 299,
	anchor : '35%'
});

var corbaTimeOut = new Ext.form.NumberField({
	id : 'corbaTimeOut',
	name : 'corbaTimeOut',
	fieldLabel : '命令超时时间',
	emptyText : '默认600秒，输入值>=600，小于1200',
	allowBlank : true,
	allowDecimals : false,
	allowNegative : false,
	minLength : 3,
	maxLength : 4,
	minValue : 600,
	maxValue : 1199,
	anchor : '35%'
});

var telnetTimeOut = new Ext.form.NumberField({
	id : 'telnetTimeOut',
	name : 'telnetTimeOut',
	fieldLabel : '命令超时时间',
	emptyText : '默认600秒，输入值>=600，小于1200',
	allowBlank : true,
	allowDecimals : false,
	allowNegative : false,
	minLength : 3,
	maxLength : 4,
	minValue : 600,
	maxValue : 1199,
	anchor : '35%'
});

// var frontPanelCobar = new Ext.FormPanel({
// id : 'frontPanelCobar',
// name : 'frontPanelCobar',
// region : "center",
// border : false,
// hidden : false,
// frame : false,
// autoScroll : true,
// items : [ corbaEmsGroup, corbaEmsName, corbaType, corbaConnectServer,
// corbaMode, corbaIpAddress, corbaPort, emsName, userName, password,
// encode, corbaIntervalTime, corbaTimeOut ]
// });

var emsNeName = new Ext.form.TextField({
	id : 'emsNeName',
	name : 'emsNeName',
	fieldLabel : '网关网元名称',
	emptyText : '请输入Telnet接口的网管网元名称',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	anchor : '35%'
});

var emsNeUser = new Ext.form.TextField({
	xtype : 'textfield',
	id : 'emsNeUser',
	name : 'emsNeUser',
	fieldLabel : '网关网元用户',
	emptyText : '请输入Telnet接口的网管网元用户',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	anchor : '35%'
});

var emsNePassword = new Ext.form.TextField({
	xtype : 'textfield',
	id : 'emsNePassword',
	name : 'emsNePassword',
	inputType : 'password',
	fieldLabel : '网关网元密码',
	emptyText : '请输入Telnet接口的网管网元密码',
//	sideText : '<font color=red>*</font>',
	allowBlank : false,
	anchor : '35%'
});

// var frontPanelTelnet = new Ext.FormPanel({
// id : 'frontPanelTelnet',
// name : 'frontPanelTelnet',
// region : "center",
// border : false,
// hidden : true,
// frame : false,
// autoScroll : true,
// items : [ telnetEmsGroup, telnetEmsName, telnetType, telnetConnectServer,
// telnetMode, telnetIpAddress, telnetPort, emsNeName, emsNeUser,
// emsNePassword, telnetIntervalTime, telnetTimeOut ]
// });

var formPanel = new Ext.FormPanel(
		{
			id : 'formPanel',
			name : 'formPanel',
			region : "center",
			border : false,
			frame : false,
			autoScroll : true,
			bodyStyle : 'padding:10px 12px 0;',
			// items : [ connectype, frontPanelCobar, frontPanelTelnet],
			items : [ connectype, telnetEmsGroup, corbaEmsGroup, telnetEmsName,
					corbaEmsName, telnetType, corbaType, telnetConnectServer,
					corbaConnectServer, telnetMode, corbaMode, telnetIpAddress,
					corbaIpAddress, telnetPort, corbaPort, emsNeName, emsName,
					emsNeUser, userName, emsNePassword, password, encode,
					telnetIntervalTime, corbaIntervalTime, telnetTimeOut,
					corbaTimeOut ]
//			,buttons : [ {
//				text : '取消',
//				handler : function() {
//					// 关闭修改任务信息窗口
////					var win = parent.Ext.getCmp('modifyConnectWindow');
////					if (win) {
////						win.close();
////					}
//					parent.Ext.getCmp('modifyConnectWindow')
//				}
//			} ]
		});


// 修改按钮传递网管连接Id，将相应信息显示在修改页面上
function initData(emsConnectionId) {
	var jsonData = {
		"emsConnectionModel.emsConnectionId" : emsConnectionId
	};

	Ext.Ajax
			.request({
				url : 'connection!getConnectionByEmsConnectionId.action',
				type : 'post',
				params : jsonData,
				success : function(response) {
					var obj = Ext.decode(response.responseText);
					// 修改telnet连接信息
					if (obj.CONNETION_TYPE == 2) {

						corbaEmsGroup.setVisible(false);
						corbaEmsName.setVisible(false);
						corbaType.setVisible(false);
						corbaConnectServer.setVisible(false);
						corbaMode.setVisible(false);
						corbaIpAddress.setVisible(false);
						corbaPort.setVisible(false);
						emsName.setVisible(false);
						userName.setVisible(false);
						password.setVisible(false);
						encode.setVisible(false);
						corbaIntervalTime.setVisible(false);
						corbaTimeOut.setVisible(false);

						telnetEmsGroup.setVisible(true);
						telnetEmsName.setVisible(true);
						telnetType.setVisible(true);
						telnetConnectServer.setVisible(true);
						telnetMode.setVisible(true);
						telnetIpAddress.setVisible(true);
						telnetPort.setVisible(true);
						emsNeName.setVisible(true);
						emsNeUser.setVisible(true);
						emsNePassword.setVisible(true);
						telnetIntervalTime.setVisible(true);
						telnetTimeOut.setVisible(true);

						Ext.getCmp("connectype").setValue(obj.CONNETION_TYPE);
						Ext.getCmp("connectype").setDisabled(true);
						// 网管分组初始化值
						if (null == obj.BASE_EMS_GROUP_ID) {
							emsGroupId = obj.BASE_EMS_GROUP_ID;
							Ext.getCmp("telnetEmsGroup").setValue('无');
						} else {
							emsGroupId = obj.BASE_EMS_GROUP_ID;
							Ext.getCmp("telnetEmsGroup").setValue(
									obj.GROUP_NAME);
						}
						Ext.getCmp("telnetEmsGroup").setDisabled(true);

						Ext.getCmp("telnetEmsName").setValue(obj.DISPLAY_NAME);
						Ext.getCmp("telnetEmsName").setDisabled(true);
						Ext.getCmp("telnetType").setValue(obj.type);
						Ext.getCmp("telnetType").setDisabled(true);
						Ext.getCmp("telnetConnectServer").setValue(
								obj.SVC_RECORD_ID);
						Ext.getCmp("telnetConnectServer").setDisabled(true);

						for (i = 0; i < telnetModeItems.length; i++) {
							if (obj.CONNECTION_MODE == telnetModeItems[i].value)
								Ext.getCmp("telnetMode").onSetValue(
										telnetModeItems[i].id, true);
						}

						Ext.getCmp("telnetIpAddress").setValue(obj.IP);
						Ext.getCmp("telnetIpAddress").setDisabled(true);
						Ext.getCmp("telnetPort").setValue(obj.PORT);
						Ext.getCmp("telnetPort").setDisabled(true);
						Ext.getCmp("emsNeName").setValue(obj.NATIVE_EMS_NAME);
						Ext.getCmp("emsNeName").setDisabled(true);
						Ext.getCmp("emsNeUser").setValue(obj.USER_NAME);
						Ext.getCmp("emsNeUser").setDisabled(true);
						Ext.getCmp("emsNePassword").setValue(obj.PASSWORD);
						Ext.getCmp("emsNePassword").setDisabled(true);
						Ext.getCmp("telnetIntervalTime").setValue(
								obj.INTERVAL_TIME);
						Ext.getCmp("telnetIntervalTime").setDisabled(true);
						Ext.getCmp("telnetTimeOut").setValue(obj.TIME_OUT);
						Ext.getCmp("telnetTimeOut").setDisabled(true);

						gateWayNeId = obj.GATEWAY_NE_ID;
					}
					// 修改Corba 连接信息
					if (obj.CONNETION_TYPE == 1) {

						telnetEmsGroup.setVisible(false);
						telnetEmsName.setVisible(false);
						telnetType.setVisible(false);
						telnetConnectServer.setVisible(false);
						telnetMode.setVisible(false);
						telnetIpAddress.setVisible(false);
						telnetPort.setVisible(false);
						emsNeName.setVisible(false);
						emsNeUser.setVisible(false);
						emsNePassword.setVisible(false);
						telnetIntervalTime.setVisible(false);
						telnetTimeOut.setVisible(false);

						corbaEmsGroup.setVisible(true);
						corbaEmsName.setVisible(true);
						corbaType.setVisible(true);
						corbaConnectServer.setVisible(true);
						corbaMode.setVisible(true);
						corbaIpAddress.setVisible(true);
						corbaPort.setVisible(true);
						emsName.setVisible(true);
						userName.setVisible(true);
						password.setVisible(true);
						encode.setVisible(true);
						corbaIntervalTime.setVisible(true);
						corbaTimeOut.setVisible(true);
						// frontPanelTelnet.setVisible(false);
						// frontPanelCobar.setVisible(true);

						Ext.getCmp("connectype").setValue(obj.CONNETION_TYPE);
						Ext.getCmp("connectype").setDisabled(true);
						// 网管分组初始化值
						if (null == obj.BASE_EMS_GROUP_ID) {
							emsGroupId = obj.BASE_EMS_GROUP_ID;
							Ext.getCmp("corbaEmsGroup").setValue('无');
						} else {
							emsGroupId = obj.BASE_EMS_GROUP_ID;
							Ext.getCmp("corbaEmsGroup").setValue(
									obj.GROUP_NAME);
						}
						Ext.getCmp("corbaEmsGroup").setDisabled(true);
						Ext.getCmp("corbaEmsName").setValue(obj.DISPLAY_NAME);
						Ext.getCmp("corbaEmsName").setDisabled(true);
						Ext.getCmp("corbaType").setValue(obj.type);
						Ext.getCmp("corbaType").setDisabled(true);
						Ext.getCmp("corbaConnectServer").setValue(
								obj.SVC_RECORD_ID);
						Ext.getCmp("corbaConnectServer").setDisabled(true);
						for (i = 0; i < corbaModeItems.length; i++) {
							if (obj.CONNECTION_MODE == corbaModeItems[i].value)
								Ext.getCmp("corbaMode").onSetValue(
										corbaModeItems[i].id, true);
						}

						Ext.getCmp("corbaIpAddress").setValue(obj.IP);
						Ext.getCmp("corbaIpAddress").setDisabled(true);
						Ext.getCmp("corbaPort").setValue(obj.PORT);
						Ext.getCmp("corbaPort").setDisabled(true);
						Ext.getCmp("encode").setValue(obj.ENCODE);
						Ext.getCmp("encode").setDisabled(true);
						Ext.getCmp("emsName").setValue(obj.EMS_NAME);
						Ext.getCmp("emsName").setDisabled(true);
						Ext.getCmp("internalEmsName").setValue(
								obj.INTERNAL_EMS_NAME);
						Ext.getCmp("internalEmsName").setDisabled(true);
						Ext.getCmp("userName").setValue(obj.USER_NAME);
						Ext.getCmp("userName").setDisabled(true);
						Ext.getCmp("password").setValue(obj.PASSWORD);
						Ext.getCmp("password").setDisabled(true);
						Ext.getCmp("corbaIntervalTime").setValue(
								obj.INTERVAL_TIME);
						Ext.getCmp("corbaIntervalTime").setDisabled(true);
						Ext.getCmp("corbaTimeOut").setValue(obj.TIME_OUT);
						Ext.getCmp("corbaTimeOut").setDisabled(true);
					}
				},
				error : function(response) {
					Ext.getBody().unmask();
					Ext.Msg.alert("错误", response.responseText);
				},
				failure : function(response) {
					Ext.getBody().unmask();
					Ext.Msg.alert("错误", response.responseText);
				}
			});
}

Ext.onReady(function() {
	Ext.BLANK_IMAGE_URL = "../../resource/ext/resources/images/default/s.gif";
	document.onmousedown = function() {
		top.Ext.menu.MenuMgr.hideAll();
	};
	Ext.Msg = top.Ext.Msg;

	initData(emsConnectionId);

	var win = new Ext.Viewport({
		id : 'win',
		layout : 'border',
		items : [ formPanel ],
		renderTo : Ext.getBody()
	});
});