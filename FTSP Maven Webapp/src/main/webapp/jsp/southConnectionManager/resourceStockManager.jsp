﻿<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.fujitsu.common.CommonDefine;"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>FTSP 传输网络维护支撑平台</title>
		<link rel="stylesheet" type="text/css" href="../../resource/ext/resources/css/ext-all.css" />
    	<link rel="stylesheet" type="text/css" href="../../resource/expandExt/css/expand.css" />
    	
    	<script type="text/javascript" src="../../resource/ext/adapter/ext/ext-base.js"></script>
    	<script type="text/javascript" src="../../resource/ext/ext-all.js"></script>
    	<script type="text/javascript" src="../../resource/expandExt/js/combo.js"></script>
    	<script type="text/javascript" src="../../resource/expandExt/js/ext-lang-zh_CN.js"></script>
    	<script type="text/javascript" src="../../resource/expandExt/js/mySessionProvider.js"></script>
    	<script type="text/javascript" src="../commonManager/commonAuthDomian.js"></script>	
    	
    	<script type="text/javascript">
    		Ext.BLANK_IMAGE_URL = "<%=request.getContextPath()%>/resource/ext/resources/images/default/s.gif";
			var leafType=<%=CommonDefine.TREE.NODE.NE%>;
			var checkModel=<%=request.getParameter("checkModel")%>;
			var userId="<%=session.getAttribute("SYS_USER_ID")%>";
	    </script>
    	
    	<script type="text/javascript" src="resourceStockManager.js"></script>
    	
	</head>
	<body>
	</body>
</html>