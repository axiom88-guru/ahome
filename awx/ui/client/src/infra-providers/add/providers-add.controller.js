/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

const user_type_options = [
 { type: 'normal', label: N_('Normal User') },
 { type: 'system_auditor', label: N_('System Auditor') },
 { type: 'system_administrator', label: N_('System Administrator') },
];

export default ['$window', '$scope', '$rootScope', '$stateParams', 'ProviderForm', 'GenerateForm', 'Rest','ParseTypeChange',
    'Alert', 'ProcessErrors', 'ReturnToCaller', 'GetBasePath', 'SaveInfraItem', 'DeleteSubJobTemplate', 'checkExistApi' ,
    'Wait', 'CreateSelect2', '$state', '$location', 'i18n','ParseVariableString', '$q', 'initSelect', 'cloudProcess',
    function($window, $scope, $rootScope, $stateParams, ProviderForm, GenerateForm, Rest, ParseTypeChange, Alert,
    ProcessErrors, ReturnToCaller, GetBasePath, SaveInfraItem, DeleteSubJobTemplate, checkExistApi, Wait, CreateSelect2, 
	$state, $location, i18n, ParseVariableString, $q, initSelect, cloudProcess) {

        var defaultUrl = GetBasePath('ipam_providers'),
        	fk_type = $window.localStorage.getItem('form_id'),
            form = ProviderForm[fk_type];

        init();

        function init() {
            // apply form definition's default field values
			console.log("Add FORM Init");
			console.log(form);
            GenerateForm.applyDefaults(form, $scope);

            $scope.isAddForm = true;

			$scope.status1 = "active";
            $scope.tabId = 1;
			$scope.previous = "CLOSE";
			$scope.next = "NEXT";
			$scope.cloud = form.cloud;

			if(!form.cloud && form.fields.kind){
				$scope.kind_type_options = initSelect('', form.fields.kind.ngValues, form.fields.kind.ngFilter ? form.fields.kind.ngFilter : "");
				if(form.credential_type == 'BuildFactory' || form.credential_type == 'Linux'){	//credential_type is machine
					$scope.kind = $scope.kind_type_options[0];
				}
				else		//credential_type is custom (need to create a new credential_type with customized form)
				{
					$scope.kind = $scope.kind_type_options[1];
				}
			}
			
			if(form.fields.datacenter) $scope.datacenter_type_options = initSelect('ipam_datacenters', '', form.fields.datacenter.ngFilter ? form.fields.datacenter.ngFilter : "");
	        if(form.fields.credential) $scope.credential_type_options = initSelect('credentials', '', form.fields.credential.ngFilter ? form.fields.credential.ngFilter : "");
<<<<<<< HEAD
			if(form.fields.status) $scope.status_type_options = initSelect('', form.fields.status.ngValues, form.fields.status.ngFilter ? form.fields.status.ngFilter : "", true);
=======

>>>>>>> adf63f446b8e9082c8a0e1740a751ec94526a324
			//$scope.kind = cloudProcess(form);
	        CreateSelect2({
	            element: '#' + fk_type + '_kind',
	            multiple: false,
	        });
	        CreateSelect2({
	            element: '#' + fk_type + '_datacenter',
	            multiple: false,
	        });
	        CreateSelect2({
	            element: '#' + fk_type + '_credential',
	            multiple: false,
	        });
	        CreateSelect2({
	            element: '#' + fk_type + '_status',
	            multiple: false,
	        });
			console.log(fk_type);
			if(fk_type == "vmware_vcenter")
			{
				Rest.setUrl(GetBasePath('hosts'));
		        Rest.get().then(({data}) => {
		        	console.log(data);
		        	console.log(form);
		        	var hostLists = data.results;
		        	var localexist = false;
		        	
		        	if(form.cloud)	//if cloud = true
		        	{
		        		var localres = [];
			        	for (var i = 0; i < hostLists.length; i++)
			        	{
				        	if(hostLists[i].name == "localhost"){
				        		console.log("localhost Exist");
				        		localres.push(hostLists[i]);
				        		localexist = true;
				        	}
				        }
				        if(localexist == true)
				        {
				        	$scope.inventory_hosts = localres;
				        }
				        else
				        {
				        	//If 'localhost' not exist, we must create a new Host named localhost
				        	//For now i will skip this
				        	//2018/11/5
				    		var localhost_data = {};
				    		localhost_data.name = "localhost";
				    		localhost_data.variables = "ansible_connection: local";
				    		localhost_data.enabled = true;
				        	Rest.setUrl(GetBasePath('hosts'));
		        			Rest.post(localhost_data).then(({data}) => {
		        				localres.push(data);
		        				$scope.inventory_hosts = localres;
		        			});
				        }
				    }
				    else  // if cloud = false
				    {
				    	
				    }
		        });
            
        	}

			// change to modal dialog
            var element = document.getElementById("modaldlg");
            element.style.display = "block";
            var panel = element.getElementsByClassName("Panel ng-scope");
            panel[0].classList.add("modal-dialog");
            panel[0].style.width = "60%";

        }
		$scope.kindChange = function(){
			console.log($scope.kind.value);
		}
        $scope.datacenterChange = function() {
            // When an scm_type is set, path is not required
            console.log($scope.datacenter);
	        var ipaddress_options = [];
			var ipaddressLists = [];
	    	Rest.setUrl(GetBasePath('ipam_ip_addresses'));
	        Rest.get().then(({data}) => {
	        	ipaddressLists = data.results;
	        	for (var i = 0; i < ipaddressLists.length; i++) {
	        		console.log(ipaddressLists[i].address);
	        		if(ipaddressLists[i].datacenter === $scope.datacenter.value)
	        		{
	        			ipaddress_options.push({label:ipaddressLists[i].address, value:ipaddressLists[i].id});
	        		}
	        	}
	        	$scope.ipaddress_type_options = ipaddress_options;l
	            for (var i = 0; i < ipaddress_options.length; i++) {
	                if (ipaddress_options[i].value === ipaddress_value) {
	                    $scope.ipaddress = ipaddress_options[i];
	                    break;
	                }
	            }
	        })
	    	.catch(({data, status}) => {
	        	ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'), msg: i18n._('Failed to get IpAddress. Get returned status: ') + status });
			});
			
			CreateSelect2({
	            element: '#' + fk_type + '_ipaddress',
	            multiple: false,
	        }); 
        };

		var callback = function() {
            // Make sure the form controller knows there was a change
            $scope[form.name + '_form'].$setDirty();
        };

        $scope.toggleForm = function(key) {
            $scope[key] = !$scope[key];
        };

		function getVars(str){
            // Quick function to test if the host vars are a json-object-string,
            // by testing if they can be converted to a JSON object w/o error.
            function IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }

            if(str === ''){
                return '---';
            }
            else if(IsJsonString(str)){
                str = JSON.parse(str);
                return jsyaml.safeDump(str);
            }
            else if(!IsJsonString(str)){
                return str;
            }
        }

		$scope.WizardClick = function (clickID) {
			if (clickID == 1) {
				if($scope.tabId > 1)
					$scope.tabId = $scope.tabId - 1;
			}
			else if (clickID == 2) {
				 
				if($scope.tabId < 4)
				{
					$scope.tabId = $scope.tabId + 1;
				}
				if($scope.tabId == 1)
				{
					$scope.opts = "---";
				}
				if((form.steps && $scope.tabId == form.steps) || (!form.steps && $scope.tabId == 3))
				{
					var fld, subid;
					var data = "{";
					for (fld in form.fields) {
						console.log($scope[fld]);
<<<<<<< HEAD
						if(fld == "datacenter" || fld == "credential" || fld == "ipaddress")
=======
						if(fld == "kind" || fld == "datacenter" || fld == "credential" || fld == "ipaddress")
>>>>>>> adf63f446b8e9082c8a0e1740a751ec94526a324
						{
							data += "'" + fld + "':";
			            	if($scope[fld] != undefined) data += "'" + $scope[fld].value + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            	continue;
						}
<<<<<<< HEAD
						if(fld == "kind" || fld == "status")
						{
							data += "'" + fld + "':";
							console.log($scope[fld]);
			            	if($scope[fld] != undefined) data += "'" + $scope[fld].label + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            	continue;
						}
=======
>>>>>>> adf63f446b8e9082c8a0e1740a751ec94526a324
						if(fld == "inventory_hosts" || fld == "instance_groups")
						{
							data += "'" + fld + "':";
							if($scope[fld] != undefined)
							{
								data += "'"
								for(subid in $scope[fld]){
									data += $scope[fld][subid].id + ',';
								}
								data = data.substring(0, data.length-1);
								data += "',"; 
							}
							else data += "'',";
							data+= "\n";
							continue;
						}
		            	if(fld != "opts")
		            	{
			            	data += "'" + fld + "':";
			            	if($scope[fld] != undefined) data += "'" + $scope[fld] + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            	
			            }
		            }
		            data += "'fk_model':'providers',\n";
		            data += "'fk_type':'" + fk_type + "'\n";
		        	data += "}";
		        	console.log(data);
		            $scope.opts = ParseVariableString(data);
					$scope.parseTypeOpts = 'yaml';
			        ParseTypeChange({
			            scope: $scope,
			            field_id: fk_type + '_opts',
			            variable: 'opts',
			            onChange: callback,
			            parse_variable: 'parseTypeOpts'
			        });
				}
			}

			if ($scope.tabId == 1) {
				$scope.status1 = "active";
				$scope.status2 = "";
				$scope.status3 = "";
				$scope.status4 = "";
				$scope.status5 = "";
			}
			else if ($scope.tabId == 2) {
				$scope.status1 = "complete";
				$scope.status2 = "active";
				$scope.status3 = "";
				$scope.status4 = "";
				$scope.status5 = "";
			}
			else if ($scope.tabId == 3) {
				$scope.status1 = "complete";
				$scope.status2 = "complete";
				$scope.status3 = "active";
				$scope.status4 = "";
				$scope.status5 = "";
			}
			else if ($scope.tabId == 4) {
				$scope.status1 = "complete";
				$scope.status2 = "complete";
				$scope.status3 = "complete";
				$scope.status4 = "active";
				$scope.status5 = "";
				console.log('scope is ');
				console.log($scope);
				
			}
			else if ($scope.tabId == 5) {
				$scope.status1 = "complete";
				$scope.status2 = "complete";
				$scope.status3 = "complete";
				$scope.status4 = "complete";
				$scope.status5 = "active";
			}
		};

        // prepares a data payload for a PUT request to the API
        var processNewData = function(fields) {
            var data = {};
    		var inputs = {};
            _.forEach(fields, function(value, key) {
                if ($scope[key] !== '' && $scope[key] !== null && $scope[key] !== undefined) {
                    data[key] = $scope[key];
                    if(key.startsWith('credential_'))
                    {
                    	inputs[key.substring(11)] = $scope[key];
                    }
                }
            });
            console.log(inputs);
            data.inputs = inputs;
            if($scope.kind != null) data.kind = $scope.kind.value;
			if($scope.datacenter != null) data.datacenter = $scope.datacenter.value;
            if($scope.credential != null) data.credential = $scope.credential.value;
    		data.opts = $scope.opts;
            return data;
        };
        // Save
        function deleteProvider(id, _callback){
        	DeleteSubJobTemplate(defaultUrl, id, '', 0);
        	_callback();
        }
        $scope.formSave = function() {
        	var data_item = processNewData(form.fields);
<<<<<<< HEAD
        	SaveInfraItem(defaultUrl, form, data_item, 'infraProvidersList');
=======
        	/*var check_flag = -100;
        	while(check_flag != -100)
        	{
        		check_flag  = checkExistApi(defaultUrl, 'name', data_item.name);
        	}
        	console.log(check_flag);
        	if(check_flag  == -1)
        	{
        		SaveInfraItem(defaultUrl, form, data_item);
        	}
        	else
        	{
        		deleteProvider(check_flag, function() {*/
        			SaveInfraItem(defaultUrl, form, data_item, 'infraProvidersList');
        		//});
    //}
>>>>>>> adf63f446b8e9082c8a0e1740a751ec94526a324
        };

        $scope.formCancel = function() {
            $state.go('infraProvidersList');
        };
    }
];
