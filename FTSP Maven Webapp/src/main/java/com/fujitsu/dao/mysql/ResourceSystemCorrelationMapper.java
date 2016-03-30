package com.fujitsu.dao.mysql;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface ResourceSystemCorrelationMapper {
	
	/**
	 * ��ȡ��Դ���������б�
	 * @return
	 */
	public List<Map<String,Object>> getResourceCorrelationTaskList();
	
	/**
	 * ��ȡ�ض���Դ����������Ϣ
	 * @param taskId
	 * @return
	 */
	public Map<String,Object> getResourceCorrelationTaskInfo(@Param(value="taskId") Integer taskId);
	
	/**
	 * ������Դ��������״̬
	 * @param paramMap
	 */
	public void updateResourceCorrelationTaskStatus(@Param(value="map") Map<String, Object> paramMap);
	
	/**
	 * ��ȡkettle job������־
	 * @param jobName
	 * @return
	 */
	public Map<String,Object> getKettleJobLog(@Param(value="jobName") String jobName);
	
}
