/*************************************************
 * Copyright (c) 2018 Ansible, Inc.
 *
 * All Rights Reserved
 * Truegardener
 *************************************************/


export default ['i18n', function(i18n) {
    return {

        name: 'ipam_securities',
        iterator: 'security',
        editTitle: i18n._('INFRA SECURITIES'),
        listTitle: i18n._('INFRA SECURITIES'),
        search: {
            order_by: 'name'
        },
        selectInstructions: '<p>Select existing users by clicking each user or checking the related checkbox. When finished, click the blue ' +
            '<em>Select</em> button, located bottom right.</p> <p>When available, a brand new user can be created by clicking the ' +
            '<i class=\"fa fa-plus\"></i> button.</p>',
        index: false,
        hover: true,
        fields: {
            status: {
                label: '',
                iconOnly: true,
                ngClick: 'showJobScript(security.id)',
				awToolTip: 'Security running status. Green:running, Blink:pending',
                dataPlacement: 'right',
                icon: "{{ 'icon-job-' + security.job_status }}",
                columnClass: "List-staticColumn--smallStatus",
                nosort: true,
                excludeModal: true
            },
            name: {
                key: true,
                label: i18n._('Name'),
                columnClass: 'col-md-2 col-sm-2 col-xs-8',
                awToolTip: "Redirect to Job Page",
                awTipPlacement: "top",
				ngClick: "infraJobs()",
            },
			id: {
                label: i18n._('Type'),
                ngBind: 'security.opts.fk_type',
                columnClass: 'col-md-2 col-sm-2 hidden-xs'
            },
            created: {
            	label: i18n._('Created'),
            	columnClass: 'col-md-2 col-sm-2 hidden-xs'
            },
            last_updated: {
                label: i18n._('Last Updated'),
                filter: "longDate",
                columnClass: "col-lg-3 hidden-md hidden-sm hidden-xs",
                excludeModal: true
            }
        },
        fieldActions: {
            columnClass: 'col-md-2 col-sm-3 col-xs-3',
            launch: {
                label: i18n._('Launch'),
                icon: 'icon-launch',
               	ngClick: "launchSecurity(security.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Launch Security'),
                dataPlacement: 'top',
            },
		    poweroff: {
                label: i18n._('Stop Security'),
                iconClass: 'fa fa-power-off',
               	ngClick: "poweroffSecurity(security.id, security.name)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Stop Security'),
                dataPlacement: 'top',
            },
			remove: {
                label: i18n._('Clean Security'),
                iconClass: 'fa fa-remove',
               	ngClick: "removeSecurity(security.id, security.name)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Remove Security'),
                dataPlacement: 'top',
            },
            edit: {
                label: i18n._('Edit'),
                icon: 'icon-edit',
               	ngClick: "editSecurity(security.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Edit Security'),
                dataPlacement: 'top',
            },
            view: {
                ngClick: "viewSecurity(security.id)",
                awToolTip: i18n._('View the Security'),
                dataPlacement: 'top',
                icon: 'fa-eye',
            },
            schedule: {
                mode: 'all',
                ngClick: "editSchedules(security.id)",
                awToolTip: i18n._('Schedule Security'),
                dataPlacement: 'top',
            },
            copy: {
                label: i18n._('Copy'),
                ngClick: 'duplicateSecurity(security.id)',
                "class": 'btn-danger btn-xs',
                awToolTip: i18n._('Duplicate Security'),
                dataPlacement: 'top',
            },
			"delete": {
                label: i18n._('Delete'),
                ngClick: "deleteSecurity(security.id, security.name)",
                icon: 'icon-trash',
                "class": 'btn-xs btn-danger',
                awToolTip: i18n._('Delete Security'),
                dataPlacement: 'top',
            }
        }
    };}];
