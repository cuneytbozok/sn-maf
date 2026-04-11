import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['06f269a7834c03105f67c9a6feaad3c8'],
    table: 'sys_ux_macroponent',
    data: {
        bundles: `[
    {
        "definitionId": "69785d8f4725211030576848946d43e3",
        "instanceId": "recordlist_1",
        "name": "Record List 1",
        "useByReference": false
    },
    {
        "definitionId": "69785d8f4725211030576848946d43e3",
        "instanceId": "recordlist_2",
        "name": "Record List 2",
        "useByReference": false
    }
]`,
        category: 'page',
        composition: `[
    {
        "bundleLink": {
            "bundleInstanceId": "recordlist_2",
            "elementType": "member",
            "originalElementId": "list_viewport_modal"
        },
        "conditionals": null,
        "definition": {
            "id": "61c315e9ccb8970546c30f3e2da41a32",
            "type": "MACROPONENT_VIEWPORT"
        },
        "elementId": "list_viewport_modal_2",
        "elementLabel": "List Viewport Modal 2",
        "eventMappings": [],
        "extensionPoints": [
            {
                "controllerElementId": "list_controller_2",
                "name": "List page modals",
                "sysId": "33d76156b7312110a2cb18075e11a9d8"
            }
        ],
        "isHidden": null,
        "overrides": null,
        "preset": {
            "controllerElementId": "list_controller_2",
            "disabledEventTargetIds": [],
            "id": "431df4d94fc3e404af2a7a1604dd08d6"
        },
        "propertyValues": {
            "disableDismiss": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "size": {
                "type": "JSON_LITERAL",
                "value": "md"
            }
        },
        "slot": null,
        "styles": null
    },
    {
        "bundleLink": {
            "bundleInstanceId": "recordlist_1",
            "elementType": "member",
            "originalElementId": "list_viewport_modal"
        },
        "conditionals": null,
        "definition": {
            "id": "61c315e9ccb8970546c30f3e2da41a32",
            "type": "MACROPONENT_VIEWPORT"
        },
        "elementId": "list_viewport_modal",
        "elementLabel": "List Viewport Modal",
        "eventMappings": [],
        "extensionPoints": [
            {
                "controllerElementId": "list_controller",
                "name": "List page modals",
                "sysId": "33d76156b7312110a2cb18075e11a9d8"
            }
        ],
        "isHidden": null,
        "overrides": null,
        "preset": {
            "controllerElementId": "list_controller",
            "disabledEventTargetIds": [],
            "id": "431df4d94fc3e404af2a7a1604dd08d6"
        },
        "propertyValues": {
            "disableDismiss": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "size": {
                "type": "JSON_LITERAL",
                "value": "md"
            }
        },
        "slot": null,
        "styles": null
    },
    {
        "definition": {
            "id": "b324da974cef96f2db1d484cfeda4e3e",
            "type": "MACROPONENT_VIEWPORT"
        },
        "elementId": "tabs_1",
        "elementLabel": "Tabs 1",
        "eventMappings": [],
        "extensionPoints": [],
        "isHidden": {
            "type": "JSON_LITERAL",
            "value": null
        },
        "items": [
            {
                "icon": "document-blank-outline",
                "id": "untitled_tab_1",
                "label": {
                    "type": "TRANSLATION_LITERAL",
                    "value": {
                        "code": null,
                        "comment": "",
                        "message": "AI Report"
                    }
                },
                "order": 100,
                "type": "local"
            },
            {
                "icon": "analytics-center-outline",
                "id": "dashboard",
                "label": {
                    "type": "TRANSLATION_LITERAL",
                    "value": {
                        "code": null,
                        "comment": "",
                        "message": "Dashboard"
                    }
                },
                "order": 200,
                "type": "local"
            },
            {
                "icon": "activity-outline",
                "id": "metric_results",
                "label": {
                    "type": "TRANSLATION_LITERAL",
                    "value": {
                        "code": null,
                        "comment": "",
                        "message": "Metric Results"
                    }
                },
                "order": 300,
                "type": "local"
            }
        ],
        "overrides": {
            "composition": [
                {
                    "definition": {
                        "id": "d356d14b6e293a3020a244b63d278d8f",
                        "type": "MACROPONENT"
                    },
                    "elementId": "untitled_tab_1",
                    "elementLabel": "AI Report",
                    "eventMappings": [],
                    "isHidden": {
                        "type": "JSON_LITERAL",
                        "value": null
                    },
                    "name": "Untitled Tab",
                    "overrides": {
                        "composition": [
                            {
                                "definition": {
                                    "id": "d356d14b6e293a3020a244b63d278d8f",
                                    "type": "MACROPONENT"
                                },
                                "elementId": "column_layout_1",
                                "elementLabel": "Column layout 1",
                                "eventMappings": [],
                                "isHidden": {
                                    "type": "JSON_LITERAL",
                                    "value": null
                                },
                                "overrides": {
                                    "composition": [
                                        {
                                            "definition": {
                                                "id": "d356d14b6e293a3020a244b63d278d8f",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "__LCabNviibBUGgeeddFeeKKYJSrJWE__column_1",
                                            "elementLabel": "Column 1",
                                            "eventMappings": [],
                                            "isHidden": {
                                                "type": "JSON_LITERAL",
                                                "value": null
                                            },
                                            "overrides": {
                                                "composition": [
                                                    {
                                                        "definition": {
                                                            "id": "d356d14b6e293a3020a244b63d278d8f",
                                                            "type": "MACROPONENT"
                                                        },
                                                        "elementId": "column_layout_2",
                                                        "elementLabel": "Column layout 2",
                                                        "eventMappings": [],
                                                        "isHidden": {
                                                            "type": "JSON_LITERAL",
                                                            "value": null
                                                        },
                                                        "overrides": {
                                                            "composition": [
                                                                {
                                                                    "definition": {
                                                                        "id": "d356d14b6e293a3020a244b63d278d8f",
                                                                        "type": "MACROPONENT"
                                                                    },
                                                                    "elementId": "__jQOaagPzFDUaaTjjYiiKddlkhTccSH__column_1",
                                                                    "elementLabel": "Column 1",
                                                                    "eventMappings": [],
                                                                    "isHidden": {
                                                                        "type": "JSON_LITERAL",
                                                                        "value": null
                                                                    },
                                                                    "overrides": {
                                                                        "composition": [
                                                                            {
                                                                                "definition": {
                                                                                    "id": "1f6e0643eca7a637e36bd7833549ec9e",
                                                                                    "type": "MACROPONENT"
                                                                                },
                                                                                "elementId": "heading_1",
                                                                                "elementLabel": "Heading 1",
                                                                                "eventMappings": [],
                                                                                "isHidden": {
                                                                                    "type": "JSON_LITERAL",
                                                                                    "value": null
                                                                                },
                                                                                "preset": null,
                                                                                "propertyValues": {
                                                                                    "align": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": "start"
                                                                                    },
                                                                                    "hasNoMargin": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": false
                                                                                    },
                                                                                    "label": {
                                                                                        "type": "TRANSLATION_LITERAL",
                                                                                        "value": {
                                                                                            "code": null,
                                                                                            "comment": "",
                                                                                            "message": "Latest Assesment Review"
                                                                                        }
                                                                                    },
                                                                                    "level": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": "1"
                                                                                    },
                                                                                    "variant": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": "header-primary"
                                                                                    },
                                                                                    "wontWrap": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": false
                                                                                    }
                                                                                },
                                                                                "slot": null,
                                                                                "styles": {}
                                                                            }
                                                                        ],
                                                                        "layout": {
                                                                            "default": {
                                                                                "children": null,
                                                                                "items": [
                                                                                    {
                                                                                        "element_id": "heading_1",
                                                                                        "styles": {
                                                                                            "align-self": "flex-start"
                                                                                        }
                                                                                    }
                                                                                ],
                                                                                "root": null,
                                                                                "styles": {
                                                                                    "align-items": "stretch",
                                                                                    "box-sizing": "border-box",
                                                                                    "flex-direction": "column",
                                                                                    "height": "100%",
                                                                                    "justify-content": "flex-start",
                                                                                    "overflow": "auto"
                                                                                },
                                                                                "type": "flex"
                                                                            },
                                                                            "disableAutoReflow": true,
                                                                            "version": "3.0.0"
                                                                        }
                                                                    },
                                                                    "preset": null,
                                                                    "propertyValues": {
                                                                        "hideEmptyStateUi": {
                                                                            "type": "JSON_LITERAL",
                                                                            "value": true
                                                                        },
                                                                        "slotWrapperBehavior": {
                                                                            "type": "JSON_LITERAL",
                                                                            "value": "contents"
                                                                        }
                                                                    },
                                                                    "scratchPad": {
                                                                        "uib": {
                                                                            "layout": {
                                                                                "column": {
                                                                                    "columnNumber": 0,
                                                                                    "id": "default",
                                                                                    "styleConfig": {
                                                                                        "external": {},
                                                                                        "internal": {}
                                                                                    }
                                                                                },
                                                                                "type": "column"
                                                                            },
                                                                            "version": "1.0.0"
                                                                        }
                                                                    },
                                                                    "slot": null,
                                                                    "styles": null
                                                                },
                                                                {
                                                                    "definition": {
                                                                        "id": "d356d14b6e293a3020a244b63d278d8f",
                                                                        "type": "MACROPONENT"
                                                                    },
                                                                    "elementId": "__vrdWeefjjOBUZZjjRUKeeddqdGuNws__column_2",
                                                                    "elementLabel": "Column 2",
                                                                    "eventMappings": [],
                                                                    "isHidden": {
                                                                        "type": "JSON_LITERAL",
                                                                        "value": null
                                                                    },
                                                                    "overrides": {
                                                                        "composition": [
                                                                            {
                                                                                "definition": {
                                                                                    "id": "4335ba6dca80378f7ba7a67cd6667bec",
                                                                                    "type": "MACROPONENT"
                                                                                },
                                                                                "elementId": "stylized_text_1",
                                                                                "elementLabel": "Stylized text 1",
                                                                                "eventMappings": [],
                                                                                "isHidden": {
                                                                                    "type": "JSON_LITERAL",
                                                                                    "value": null
                                                                                },
                                                                                "preset": null,
                                                                                "propertyValues": {
                                                                                    "configAria": {
                                                                                        "container": {},
                                                                                        "type": "MAP_CONTAINER"
                                                                                    },
                                                                                    "css": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": "* { }"
                                                                                    },
                                                                                    "tag": {
                                                                                        "type": "JSON_LITERAL",
                                                                                        "value": "h5"
                                                                                    },
                                                                                    "text": {
                                                                                        "binding": {
                                                                                            "address": [
                                                                                                "look_up_multiple_records_1",
                                                                                                "results",
                                                                                                "0",
                                                                                                "sys_created_on",
                                                                                                "displayValue"
                                                                                            ]
                                                                                        },
                                                                                        "type": "DATA_OUTPUT_BINDING"
                                                                                    }
                                                                                },
                                                                                "slot": null,
                                                                                "styles": {}
                                                                            }
                                                                        ],
                                                                        "layout": {
                                                                            "default": {
                                                                                "children": null,
                                                                                "items": [
                                                                                    {
                                                                                        "element_id": "stylized_text_1",
                                                                                        "styles": {
                                                                                            "align-self": "flex-end"
                                                                                        }
                                                                                    }
                                                                                ],
                                                                                "root": null,
                                                                                "styles": {
                                                                                    "align-items": "stretch",
                                                                                    "box-sizing": "border-box",
                                                                                    "flex-direction": "column",
                                                                                    "height": "100%",
                                                                                    "justify-content": "flex-start",
                                                                                    "overflow": "auto"
                                                                                },
                                                                                "type": "flex"
                                                                            },
                                                                            "disableAutoReflow": true,
                                                                            "version": "3.0.0"
                                                                        }
                                                                    },
                                                                    "preset": null,
                                                                    "propertyValues": {
                                                                        "hideEmptyStateUi": {
                                                                            "type": "JSON_LITERAL",
                                                                            "value": true
                                                                        },
                                                                        "slotWrapperBehavior": {
                                                                            "type": "JSON_LITERAL",
                                                                            "value": "contents"
                                                                        }
                                                                    },
                                                                    "scratchPad": {
                                                                        "uib": {
                                                                            "layout": {
                                                                                "column": {
                                                                                    "columnNumber": 0,
                                                                                    "id": "default",
                                                                                    "styleConfig": {
                                                                                        "external": {},
                                                                                        "internal": {}
                                                                                    }
                                                                                },
                                                                                "type": "column"
                                                                            },
                                                                            "version": "1.0.0"
                                                                        }
                                                                    },
                                                                    "slot": null,
                                                                    "styles": null
                                                                }
                                                            ],
                                                            "layout": {
                                                                "default": {
                                                                    "children": null,
                                                                    "isInline": null,
                                                                    "items": [
                                                                        {
                                                                            "element_id": "__jQOaagPzFDUaaTjjYiiKddlkhTccSH__column_1",
                                                                            "styles": {
                                                                                "display": "contents"
                                                                            }
                                                                        },
                                                                        {
                                                                            "element_id": "__vrdWeefjjOBUZZjjRUKeeddqdGuNws__column_2",
                                                                            "styles": {
                                                                                "display": "contents"
                                                                            }
                                                                        }
                                                                    ],
                                                                    "root": null,
                                                                    "rules": null,
                                                                    "styles": {
                                                                        "box-sizing": "border-box",
                                                                        "display": "grid",
                                                                        "grid-auto-columns": "1fr",
                                                                        "grid-auto-rows": "1fr",
                                                                        "grid-template-columns": "50.00047966231773fr 49.99952033768227fr",
                                                                        "grid-template-rows": "1fr",
                                                                        "width": "auto"
                                                                    },
                                                                    "type": "grid"
                                                                },
                                                                "disableAutoReflow": true,
                                                                "queries": [
                                                                    {
                                                                        "layout": {
                                                                            "children": null,
                                                                            "isInline": null,
                                                                            "items": [],
                                                                            "root": null,
                                                                            "rules": null,
                                                                            "styles": {
                                                                                "grid-template-columns": "1fr",
                                                                                "height": "fit-content",
                                                                                "max-height": "max-content",
                                                                                "min-height": "min-content"
                                                                            },
                                                                            "type": "grid"
                                                                        },
                                                                        "query": {
                                                                            "max-width": 640
                                                                        }
                                                                    }
                                                                ],
                                                                "version": "3.0.0"
                                                            }
                                                        },
                                                        "preset": null,
                                                        "propertyValues": {
                                                            "hideEmptyStateUi": {
                                                                "type": "JSON_LITERAL",
                                                                "value": true
                                                            },
                                                            "slotWrapperBehavior": {
                                                                "type": "JSON_LITERAL",
                                                                "value": "contents"
                                                            }
                                                        },
                                                        "scratchPad": {
                                                            "uib": {
                                                                "layout": {
                                                                    "columnSection": {
                                                                        "breakpoints": [
                                                                            {
                                                                                "behavior": "stack",
                                                                                "max-width": 640,
                                                                                "styles": {
                                                                                    "grid-template-columns": "1fr",
                                                                                    "height": "fit-content",
                                                                                    "max-height": "max-content",
                                                                                    "min-height": "min-content"
                                                                                }
                                                                            }
                                                                        ],
                                                                        "children": [
                                                                            {
                                                                                "columnNumber": 1,
                                                                                "unit": "%",
                                                                                "width": 50.00047966231773
                                                                            },
                                                                            {
                                                                                "columnNumber": 2,
                                                                                "unit": "%",
                                                                                "width": 49.99952033768227
                                                                            }
                                                                        ],
                                                                        "id": "UIB_COLUMN_SECTION_SINGLE_COLUMN_SECTION",
                                                                        "styleConfig": {
                                                                            "external": {},
                                                                            "internal": {}
                                                                        }
                                                                    },
                                                                    "type": "columnSection"
                                                                },
                                                                "version": "1.0.0"
                                                            }
                                                        },
                                                        "slot": null,
                                                        "styles": null
                                                    },
                                                    {
                                                        "definition": {
                                                            "id": "2d56f06d55f46bbd4e79b5e624beb940",
                                                            "type": "MACROPONENT"
                                                        },
                                                        "elementId": "rich_text_1",
                                                        "elementLabel": "Rich text 1",
                                                        "eventMappings": [],
                                                        "isHidden": {
                                                            "type": "JSON_LITERAL",
                                                            "value": null
                                                        },
                                                        "preset": null,
                                                        "propertyValues": {
                                                            "html": {
                                                                "script": {
                                                                    "apiVersion": "2.0.0",
                                                                    "controllerElementId": null,
                                                                    "inlineScript": null,
                                                                    "scriptSysId": "c5e3a56b834c03105f67c9a6feaad342",
                                                                    "target": null
                                                                },
                                                                "type": "CLIENT_TRANSFORM_SCRIPT"
                                                            }
                                                        },
                                                        "slot": null,
                                                        "styleClass": {
                                                            "type": "JSON_LITERAL",
                                                            "value": "maf-ai-llm-summary"
                                                        },
                                                        "styles": null
                                                    }
                                                ],
                                                "layout": {
                                                    "default": {
                                                        "children": null,
                                                        "items": [
                                                            {
                                                                "element_id": "column_layout_2",
                                                                "styles": {
                                                                    "display": "contents"
                                                                }
                                                            },
                                                            {
                                                                "element_id": "rich_text_1",
                                                                "styles": {
                                                                    "align-self": "stretch",
                                                                    "margin-left": "0",
                                                                    "margin-right": "0",
                                                                    "padding-left": "0",
                                                                    "padding-right": "0"
                                                                }
                                                            }
                                                        ],
                                                        "root": null,
                                                        "styles": {
                                                            "align-items": "stretch",
                                                            "box-sizing": "border-box",
                                                            "flex-direction": "column",
                                                            "height": "100%",
                                                            "justify-content": "flex-start",
                                                            "overflow": "auto"
                                                        },
                                                        "type": "flex"
                                                    },
                                                    "disableAutoReflow": true,
                                                    "version": "3.0.0"
                                                }
                                            },
                                            "preset": null,
                                            "propertyValues": {
                                                "hideEmptyStateUi": {
                                                    "type": "JSON_LITERAL",
                                                    "value": true
                                                },
                                                "slotWrapperBehavior": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "contents"
                                                }
                                            },
                                            "scratchPad": {
                                                "uib": {
                                                    "layout": {
                                                        "column": {
                                                            "columnNumber": 0,
                                                            "id": "default",
                                                            "styleConfig": {
                                                                "external": {},
                                                                "internal": {}
                                                            }
                                                        },
                                                        "type": "column"
                                                    },
                                                    "version": "1.0.0"
                                                }
                                            },
                                            "slot": null,
                                            "styles": null
                                        }
                                    ],
                                    "layout": {
                                        "default": {
                                            "children": null,
                                            "isInline": null,
                                            "items": [
                                                {
                                                    "element_id": "__LCabNviibBUGgeeddFeeKKYJSrJWE__column_1",
                                                    "styles": {
                                                        "display": "contents"
                                                    }
                                                }
                                            ],
                                            "root": null,
                                            "rules": null,
                                            "styles": {
                                                "box-sizing": "border-box",
                                                "display": "grid",
                                                "grid-auto-columns": "1fr",
                                                "grid-auto-rows": "1fr",
                                                "grid-template-columns": "100fr",
                                                "grid-template-rows": "1fr",
                                                "padding-bottom": "var(--now-scalable-space--xxl)",
                                                "padding-left": "var(--now-scalable-space--lg)",
                                                "padding-right": "var(--now-scalable-space--lg)",
                                                "width": "auto"
                                            },
                                            "type": "grid"
                                        },
                                        "disableAutoReflow": true,
                                        "queries": [
                                            {
                                                "layout": {
                                                    "children": null,
                                                    "isInline": null,
                                                    "items": [],
                                                    "root": null,
                                                    "rules": null,
                                                    "styles": {
                                                        "grid-template-columns": "1fr",
                                                        "height": "fit-content",
                                                        "max-height": "max-content",
                                                        "min-height": "min-content"
                                                    },
                                                    "type": "grid"
                                                },
                                                "query": {
                                                    "max-width": 640
                                                }
                                            }
                                        ],
                                        "version": "3.0.0"
                                    }
                                },
                                "preset": null,
                                "propertyValues": {
                                    "hideEmptyStateUi": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "slotWrapperBehavior": {
                                        "type": "JSON_LITERAL",
                                        "value": "contents"
                                    }
                                },
                                "scratchPad": {
                                    "uib": {
                                        "layout": {
                                            "columnSection": {
                                                "breakpoints": [
                                                    {
                                                        "behavior": "stack",
                                                        "max-width": 640,
                                                        "styles": {
                                                            "grid-template-columns": "1fr",
                                                            "height": "fit-content",
                                                            "max-height": "max-content",
                                                            "min-height": "min-content"
                                                        }
                                                    }
                                                ],
                                                "children": [
                                                    {
                                                        "columnNumber": 1,
                                                        "unit": "%",
                                                        "width": 100
                                                    }
                                                ],
                                                "id": "UIB_COLUMN_SECTION_SINGLE_COLUMN_SECTION",
                                                "styleConfig": {
                                                    "external": {},
                                                    "internal": {}
                                                }
                                            },
                                            "type": "columnSection"
                                        },
                                        "version": "1.0.0"
                                    }
                                },
                                "slot": null,
                                "styles": {}
                            }
                        ],
                        "layout": {
                            "default": {
                                "children": null,
                                "items": [
                                    {
                                        "element_id": "column_layout_1",
                                        "styles": {
                                            "display": "contents"
                                        }
                                    }
                                ],
                                "root": null,
                                "rules": null,
                                "styles": {
                                    "flex-direction": "column",
                                    "min-height": "300px",
                                    "width": "100%"
                                },
                                "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
                                "type": "flex"
                            },
                            "version": "3.0.0"
                        }
                    },
                    "preset": null,
                    "propertyValues": {
                        "ariaRegionHeadingLevel": {
                            "type": "JSON_LITERAL",
                            "value": "1"
                        },
                        "ariaRegionName": {
                            "type": "TRANSLATION_LITERAL",
                            "value": {
                                "code": null,
                                "comment": "",
                                "message": ""
                            }
                        },
                        "ariaRole": {
                            "type": "JSON_LITERAL",
                            "value": ""
                        },
                        "hideEmptyStateUi": {
                            "type": "JSON_LITERAL",
                            "value": true
                        },
                        "includeAriaHeading": {
                            "type": "JSON_LITERAL",
                            "value": false
                        },
                        "slotWrapperBehavior": {
                            "type": "JSON_LITERAL",
                            "value": "fullheight"
                        },
                        "type": {
                            "type": "JSON_LITERAL",
                            "value": "section"
                        }
                    },
                    "slot": "untitled_tab_1",
                    "styles": null
                },
                {
                    "definition": {
                        "id": "d356d14b6e293a3020a244b63d278d8f",
                        "type": "MACROPONENT"
                    },
                    "elementId": "dashboard",
                    "elementLabel": "Dashboard",
                    "eventMappings": [],
                    "isHidden": {
                        "type": "JSON_LITERAL",
                        "value": null
                    },
                    "name": "Dashboard",
                    "overrides": {
                        "composition": [
                            {
                                "definition": {
                                    "id": "226449101138d0dff1abe0e1566c8b2a",
                                    "type": "MACROPONENT"
                                },
                                "elementId": "filter_1",
                                "elementLabel": "Filter 1",
                                "eventMappings": [],
                                "isHidden": {
                                    "type": "JSON_LITERAL",
                                    "value": null
                                },
                                "preset": null,
                                "propertyValues": {
                                    "allowTimeSelection": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "allowedDateRanges": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "booleanLabelFalse": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "booleanLabelTrue": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "cascadeScope": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "cascadingConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "datasource": {
                                        "type": "JSON_LITERAL",
                                        "value": {
                                            "payload": {
                                                "primaryKey": "sys_id",
                                                "table": "x_maf_core_assessment_run"
                                            },
                                            "type": "table"
                                        }
                                    },
                                    "dateFilterView": {
                                        "type": "JSON_LITERAL",
                                        "value": "calendar-reldates"
                                    },
                                    "defaultBoolean": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "defaultDateEnd": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "defaultDateStart": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "defaultSelectedDateRange": {
                                        "type": "JSON_LITERAL",
                                        "value": {
                                            "range": ""
                                        }
                                    },
                                    "defaultSelectedItems": {
                                        "type": "JSON_LITERAL",
                                        "value": []
                                    },
                                    "enableClearFilter": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "enableResetToDefault": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "filterComponentType": {
                                        "type": "JSON_LITERAL",
                                        "value": "singleselect"
                                    },
                                    "filterConfigurations": {
                                        "binding": {
                                            "address": [
                                                "parFilters"
                                            ]
                                        },
                                        "type": "STATE_BINDING"
                                    },
                                    "filterElementLayout": {
                                        "type": "JSON_LITERAL",
                                        "value": "vertical"
                                    },
                                    "filterElementType": {
                                        "type": "JSON_LITERAL",
                                        "value": "pill"
                                    },
                                    "filterId": {
                                        "type": "JSON_LITERAL",
                                        "value": "1jlsb052mjs7fdksfd3s"
                                    },
                                    "filterName": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "Assesment Run"
                                        }
                                    },
                                    "filterProperties": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "isDashboard": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "isGroup": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "isShowSelectedValueInPill": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "maxElements": {
                                        "type": "JSON_LITERAL",
                                        "value": 10
                                    },
                                    "primaryActionLabel": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "Apply"
                                        }
                                    },
                                    "sort": {
                                        "type": "JSON_LITERAL",
                                        "value": "DESC"
                                    },
                                    "targets": {
                                        "type": "JSON_LITERAL",
                                        "value": [
                                            {
                                                "payload": {
                                                    "primaryKey": "sys_id",
                                                    "table": "x_maf_core_assessment_run"
                                                },
                                                "type": "table"
                                            }
                                        ]
                                    }
                                },
                                "slot": null,
                                "styles": null
                            },
                            {
                                "definition": {
                                    "id": "85855283b7e03010097cb81cde11a91d",
                                    "type": "MACROPONENT"
                                },
                                "elementId": "horizontal_bar_1",
                                "elementLabel": "Horizontal bar 1",
                                "eventMappings": [],
                                "isHidden": {
                                    "type": "JSON_LITERAL",
                                    "value": null
                                },
                                "preset": null,
                                "propertyValues": {
                                    "additionalGroupByConfig": {
                                        "container": [],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "allowAdditionalGroupByPerMetric": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "allowChangeDateRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "applyDateRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "backgroundRefreshInterval": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "bareBorder": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "cacheExpirationTime": {
                                        "type": "JSON_LITERAL",
                                        "value": 0
                                    },
                                    "chartExtraConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "chartSize": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "chartVariation": {
                                        "type": "JSON_LITERAL",
                                        "value": "stacked"
                                    },
                                    "colorConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": {
                                            "type": "default"
                                        }
                                    },
                                    "colors": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "componentId": {
                                        "type": "JSON_LITERAL",
                                        "value": "lnv6v4sz"
                                    },
                                    "configPropModifiers": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "configVersion": {
                                        "type": "JSON_LITERAL",
                                        "value": "23.0.0-ci-SNAPSHOT"
                                    },
                                    "contextMenuActions": {
                                        "container": [],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "dataCategory": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "dataLabelPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "middle"
                                    },
                                    "dataPassthrough": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "dataSources": {
                                        "container": [
                                            {
                                                "container": {
                                                    "allowRealTime": {
                                                        "type": "JSON_LITERAL",
                                                        "value": true
                                                    },
                                                    "dataCategories": {
                                                        "type": "JSON_LITERAL",
                                                        "value": [
                                                            "trend",
                                                            "group",
                                                            "simple"
                                                        ]
                                                    },
                                                    "filterQuery": {
                                                        "type": "JSON_LITERAL",
                                                        "value": ""
                                                    },
                                                    "id": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "dGFibGV4X21hZl9jb3JlX2NhdGVnb3J5X3Njb3JlMTc3NTg0NjQwMTc1NQ=="
                                                    },
                                                    "isDatabaseView": {
                                                        "type": "JSON_LITERAL",
                                                        "value": false
                                                    },
                                                    "label": {
                                                        "type": "TRANSLATION_LITERAL",
                                                        "value": {
                                                            "code": null,
                                                            "comment": "",
                                                            "message": "MAF Category Score"
                                                        }
                                                    },
                                                    "preferredVisualizations": {
                                                        "type": "JSON_LITERAL",
                                                        "value": [
                                                            "d24d53f60350de7a652caf3188a46ed2"
                                                        ]
                                                    },
                                                    "reportSourceSysId": {
                                                        "type": "JSON_LITERAL"
                                                    },
                                                    "sourceType": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "table"
                                                    },
                                                    "tableOrViewName": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "x_maf_core_category_score"
                                                    }
                                                },
                                                "type": "MAP_CONTAINER"
                                            }
                                        ],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "dateFormat": {
                                        "type": "JSON_LITERAL",
                                        "value": "default"
                                    },
                                    "description": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "drilldownLabel": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "emptyStateAlignment": {
                                        "type": "JSON_LITERAL",
                                        "value": "vertical-centered"
                                    },
                                    "emptyStateContent": {
                                        "type": "JSON_LITERAL",
                                        "value": "There are no scores available for the selected criteria. Contact your admin for more info."
                                    },
                                    "emptyStateHeading": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "No data available."
                                        }
                                    },
                                    "emptyStateHeadingLevel": {
                                        "type": "JSON_LITERAL",
                                        "value": 3
                                    },
                                    "emptyStateIllustration": {
                                        "type": "JSON_LITERAL",
                                        "value": "no-data"
                                    },
                                    "enableAddZerosAtApi": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "enableClickAndStay": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "enableCustomEmptyState": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "enableDrilldown": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "enableRealTimeUpdate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "endTime": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "filterConfigurations": {
                                        "binding": {
                                            "address": [
                                                "parFilters"
                                            ]
                                        },
                                        "type": "STATE_BINDING"
                                    },
                                    "filterPerMetric": {
                                        "type": "JSON_LITERAL",
                                        "value": []
                                    },
                                    "followFilters": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "forecastConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "formats": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "groupBy": {
                                        "type": "JSON_LITERAL",
                                        "value": [
                                            {
                                                "disableRanges": false,
                                                "groupBy": [
                                                    {
                                                        "dataSource": "dGFibGV4X21hZl9jb3JlX2NhdGVnb3J5X3Njb3JlMTc3NTg0NjQwMTc1NQ==",
                                                        "groupByField": "category",
                                                        "isChoice": false,
                                                        "isPaBucket": false,
                                                        "isRange": false
                                                    }
                                                ],
                                                "maxNumberOfGroups": "ALL",
                                                "numberOfGroupsBasedOn": "NO_OF_GROUP_BASED_ON_PER_METRIC",
                                                "showOthers": false
                                            }
                                        ]
                                    },
                                    "groupByConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "headerColor": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "headerTitle": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "Categories"
                                        }
                                    },
                                    "headingLevel": {
                                        "type": "JSON_LITERAL",
                                        "value": 2
                                    },
                                    "headingPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "top"
                                    },
                                    "hideDevSettings": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "hideMatrixAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "iconStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "background"
                                    },
                                    "isComponentInView": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "legendExpandToFit": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "legendHorizontalAlignment": {
                                        "type": "JSON_LITERAL",
                                        "value": "center"
                                    },
                                    "legendMaxItemWidth": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "legendPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "bottom"
                                    },
                                    "metrics": {
                                        "container": [
                                            {
                                                "container": {
                                                    "aggregateField": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "score"
                                                    },
                                                    "aggregateFunction": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "SUM"
                                                    },
                                                    "axisId": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "primary"
                                                    },
                                                    "dataSource": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "dGFibGV4X21hZl9jb3JlX2NhdGVnb3J5X3Njb3JlMTc3NTg0NjQwMTc1NQ=="
                                                    },
                                                    "id": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "ZEdGaWJHVjRYMjFoWmw5amIzSmxYMk5oZEdWbmIzSjVYM05qYjNKbE1UYzNOVGcwTmpRd01UYzFOUT09MTc3NTg0NjQwNDA4MQ=="
                                                    },
                                                    "numberFormat": {
                                                        "type": "JSON_LITERAL",
                                                        "value": {
                                                            "customFormat": false
                                                        }
                                                    }
                                                },
                                                "type": "MAP_CONTAINER"
                                            }
                                        ],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "newReporting": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "numberOfPeriods": {
                                        "type": "JSON_LITERAL",
                                        "value": 3
                                    },
                                    "pageId": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "period": {
                                        "type": "JSON_LITERAL",
                                        "value": "M"
                                    },
                                    "rangesConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "refreshFrequency": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "refreshRequest": {
                                        "type": "JSON_LITERAL",
                                        "value": ""
                                    },
                                    "scoreIcon": {
                                        "type": "JSON_LITERAL",
                                        "value": ""
                                    },
                                    "scoreSize": {
                                        "type": "JSON_LITERAL",
                                        "value": "auto"
                                    },
                                    "scoreType": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "selectedElements": {
                                        "type": "JSON_LITERAL",
                                        "value": []
                                    },
                                    "sharedContext": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "showAbsolutePeriod": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showAdditionalGroupBySelector": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showBorder": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showCacheTime": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showChange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showChangeFrom": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showChangePercentage": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showClosestSeriesOnHover": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showComment": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showConfidenceBand": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDataLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showDataPassthrough": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDataTable": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDateRangeByDefault": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showExtendedErrorMessages": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "showFilterAsSeparateSeries": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showFilterIcon": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showFirstGroupAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showForecast": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showForecastRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showGapPercentage": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showHeader": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showHeaderSeparator": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showLegend": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showLegendValue": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showLoadingIndicator": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showMaximumRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showMetricLabel": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showOverlappingLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showRefresh": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showScoreDate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showScoreUpdateTime": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showSecondGroupAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showSparkline": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showStackedValues": {
                                        "type": "JSON_LITERAL",
                                        "value": "none"
                                    },
                                    "showSubAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTarget": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showThreshold": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTotalAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTotalValue": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "showTrend": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showZero": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "sortBy": {
                                        "type": "JSON_LITERAL",
                                        "value": "value"
                                    },
                                    "sortByOrder": {
                                        "type": "JSON_LITERAL",
                                        "value": "desc"
                                    },
                                    "sparklineStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "area"
                                    },
                                    "standardFormatData": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "startTime": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "telemetry": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "title": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "titleColor": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "trendBy": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "useCurrentDateForEnd": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "useDataCache": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "useRelativeScoreTime": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "userInfo": {
                                        "binding": {
                                            "address": [
                                                "user"
                                            ],
                                            "category": "session"
                                        },
                                        "type": "CONTEXT_BINDING"
                                    },
                                    "wrapTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "xAxisHidden": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "xAxisMaxLabelSize": {
                                        "type": "JSON_LITERAL",
                                        "value": 1000
                                    },
                                    "xAxisTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "xAxisTruncationType": {
                                        "type": "JSON_LITERAL",
                                        "value": "end"
                                    },
                                    "xAxisWrapLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "yAxisFrom": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "yAxisHidden": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "yAxisPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "bottom"
                                    },
                                    "yAxisShowGrid": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "yAxisStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "clean"
                                    },
                                    "yAxisTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "yAxisTo": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    }
                                },
                                "slot": null,
                                "styles": null
                            },
                            {
                                "definition": {
                                    "id": "85855283b7e03010097cb81cde11a91d",
                                    "type": "MACROPONENT"
                                },
                                "elementId": "horizontal_bar_2",
                                "elementLabel": "Horizontal bar 2",
                                "eventMappings": [],
                                "isHidden": {
                                    "type": "JSON_LITERAL",
                                    "value": null
                                },
                                "preset": null,
                                "propertyValues": {
                                    "additionalGroupByConfig": {
                                        "container": [],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "allowAdditionalGroupByPerMetric": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "allowChangeDateRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "applyDateRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "backgroundRefreshInterval": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "bareBorder": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "cacheExpirationTime": {
                                        "type": "JSON_LITERAL",
                                        "value": 0
                                    },
                                    "chartExtraConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "chartSize": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "chartVariation": {
                                        "type": "JSON_LITERAL",
                                        "value": "stacked"
                                    },
                                    "colorConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": {
                                            "type": "default"
                                        }
                                    },
                                    "colors": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "componentId": {
                                        "type": "JSON_LITERAL",
                                        "value": "lnv6v4sz"
                                    },
                                    "configPropModifiers": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "configVersion": {
                                        "type": "JSON_LITERAL",
                                        "value": "23.0.0-ci-SNAPSHOT"
                                    },
                                    "contextMenuActions": {
                                        "container": [],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "dataCategory": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "dataLabelPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "middle"
                                    },
                                    "dataPassthrough": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "dataSources": {
                                        "container": [
                                            {
                                                "container": {
                                                    "allowRealTime": {
                                                        "type": "JSON_LITERAL",
                                                        "value": true
                                                    },
                                                    "dataCategories": {
                                                        "type": "JSON_LITERAL",
                                                        "value": [
                                                            "trend",
                                                            "group",
                                                            "simple"
                                                        ]
                                                    },
                                                    "filterQuery": {
                                                        "type": "JSON_LITERAL",
                                                        "value": ""
                                                    },
                                                    "id": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "dGFibGV4X21hZl9jb3JlX3N1Yl9jYXRlZ29yeV9zY29yZTE3NzU4NDY1NTAxOTc="
                                                    },
                                                    "isDatabaseView": {
                                                        "type": "JSON_LITERAL",
                                                        "value": false
                                                    },
                                                    "label": {
                                                        "type": "TRANSLATION_LITERAL",
                                                        "value": {
                                                            "code": null,
                                                            "comment": "",
                                                            "message": "MAF Sub-category Score"
                                                        }
                                                    },
                                                    "preferredVisualizations": {
                                                        "type": "JSON_LITERAL",
                                                        "value": [
                                                            "d24d53f60350de7a652caf3188a46ed2"
                                                        ]
                                                    },
                                                    "reportSourceSysId": {
                                                        "type": "JSON_LITERAL"
                                                    },
                                                    "sourceType": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "table"
                                                    },
                                                    "tableOrViewName": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "x_maf_core_sub_category_score"
                                                    }
                                                },
                                                "type": "MAP_CONTAINER"
                                            }
                                        ],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "dateFormat": {
                                        "type": "JSON_LITERAL",
                                        "value": "default"
                                    },
                                    "description": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "drilldownLabel": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "emptyStateAlignment": {
                                        "type": "JSON_LITERAL",
                                        "value": "vertical-centered"
                                    },
                                    "emptyStateContent": {
                                        "type": "JSON_LITERAL",
                                        "value": "There are no scores available for the selected criteria. Contact your admin for more info."
                                    },
                                    "emptyStateHeading": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "No data available."
                                        }
                                    },
                                    "emptyStateHeadingLevel": {
                                        "type": "JSON_LITERAL",
                                        "value": 3
                                    },
                                    "emptyStateIllustration": {
                                        "type": "JSON_LITERAL",
                                        "value": "no-data"
                                    },
                                    "enableAddZerosAtApi": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "enableClickAndStay": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "enableCustomEmptyState": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "enableDrilldown": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "enableRealTimeUpdate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "endTime": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "filterConfigurations": {
                                        "binding": {
                                            "address": [
                                                "parFilters"
                                            ]
                                        },
                                        "type": "STATE_BINDING"
                                    },
                                    "filterPerMetric": {
                                        "type": "JSON_LITERAL",
                                        "value": []
                                    },
                                    "followFilters": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "forecastConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "formats": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "groupBy": {
                                        "type": "JSON_LITERAL",
                                        "value": [
                                            {
                                                "disableRanges": false,
                                                "groupBy": [
                                                    {
                                                        "dataSource": "dGFibGV4X21hZl9jb3JlX3N1Yl9jYXRlZ29yeV9zY29yZTE3NzU4NDY1NTAxOTc=",
                                                        "groupByField": "sub_category",
                                                        "isChoice": false,
                                                        "isPaBucket": false,
                                                        "isRange": false
                                                    }
                                                ],
                                                "maxNumberOfGroups": "ALL",
                                                "numberOfGroupsBasedOn": "NO_OF_GROUP_BASED_ON_PER_METRIC",
                                                "showOthers": false
                                            }
                                        ]
                                    },
                                    "groupByConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "headerColor": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "headerTitle": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": "Sub-categories"
                                        }
                                    },
                                    "headingLevel": {
                                        "type": "JSON_LITERAL",
                                        "value": 2
                                    },
                                    "headingPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "top"
                                    },
                                    "hideDevSettings": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "hideMatrixAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "iconStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "background"
                                    },
                                    "isComponentInView": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "legendExpandToFit": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "legendHorizontalAlignment": {
                                        "type": "JSON_LITERAL",
                                        "value": "center"
                                    },
                                    "legendMaxItemWidth": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "legendPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "bottom"
                                    },
                                    "metrics": {
                                        "container": [
                                            {
                                                "container": {
                                                    "aggregateField": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "score"
                                                    },
                                                    "aggregateFunction": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "SUM"
                                                    },
                                                    "axisId": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "primary"
                                                    },
                                                    "dataSource": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "dGFibGV4X21hZl9jb3JlX3N1Yl9jYXRlZ29yeV9zY29yZTE3NzU4NDY1NTAxOTc="
                                                    },
                                                    "id": {
                                                        "type": "JSON_LITERAL",
                                                        "value": "ZEdGaWJHVjRYMjFoWmw5amIzSmxYM04xWWw5allYUmxaMjl5ZVY5elkyOXlaVEUzTnpVNE5EWTFOVEF4T1RjPTE3NzU4NDY1NTA4OTE="
                                                    },
                                                    "numberFormat": {
                                                        "type": "JSON_LITERAL",
                                                        "value": {
                                                            "customFormat": false
                                                        }
                                                    }
                                                },
                                                "type": "MAP_CONTAINER"
                                            }
                                        ],
                                        "type": "LIST_CONTAINER"
                                    },
                                    "newReporting": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "numberOfPeriods": {
                                        "type": "JSON_LITERAL",
                                        "value": 3
                                    },
                                    "pageId": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "period": {
                                        "type": "JSON_LITERAL",
                                        "value": "M"
                                    },
                                    "rangesConfig": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "refreshFrequency": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "refreshRequest": {
                                        "type": "JSON_LITERAL",
                                        "value": ""
                                    },
                                    "scoreIcon": {
                                        "type": "JSON_LITERAL",
                                        "value": ""
                                    },
                                    "scoreSize": {
                                        "type": "JSON_LITERAL",
                                        "value": "auto"
                                    },
                                    "scoreType": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "selectedElements": {
                                        "type": "JSON_LITERAL",
                                        "value": []
                                    },
                                    "sharedContext": {
                                        "type": "JSON_LITERAL",
                                        "value": {}
                                    },
                                    "showAbsolutePeriod": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showAdditionalGroupBySelector": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showBorder": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showCacheTime": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showChange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showChangeFrom": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showChangePercentage": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showClosestSeriesOnHover": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showComment": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showConfidenceBand": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDataLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showDataPassthrough": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDataTable": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showDateRangeByDefault": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showExtendedErrorMessages": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "showFilterAsSeparateSeries": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showFilterIcon": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showFirstGroupAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showForecast": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showForecastRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showGapPercentage": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showHeader": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showHeaderSeparator": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showLegend": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showLegendValue": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showLoadingIndicator": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showMaximumRange": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showMetricLabel": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showOverlappingLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showRefresh": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "showScoreDate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showScoreUpdateTime": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showSecondGroupAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showSparkline": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showStackedValues": {
                                        "type": "JSON_LITERAL",
                                        "value": "none"
                                    },
                                    "showSubAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTarget": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showThreshold": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTotalAggregate": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showTotalValue": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "showTrend": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "showZero": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "sortBy": {
                                        "type": "JSON_LITERAL",
                                        "value": "value"
                                    },
                                    "sortByOrder": {
                                        "type": "JSON_LITERAL",
                                        "value": "desc"
                                    },
                                    "sparklineStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "area"
                                    },
                                    "standardFormatData": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "startTime": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "telemetry": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "title": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "titleColor": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "trendBy": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "useCurrentDateForEnd": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "useDataCache": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "useRelativeScoreTime": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "userInfo": {
                                        "binding": {
                                            "address": [
                                                "user"
                                            ],
                                            "category": "session"
                                        },
                                        "type": "CONTEXT_BINDING"
                                    },
                                    "wrapTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "xAxisHidden": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "xAxisMaxLabelSize": {
                                        "type": "JSON_LITERAL",
                                        "value": 1000
                                    },
                                    "xAxisTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "xAxisTruncationType": {
                                        "type": "JSON_LITERAL",
                                        "value": "end"
                                    },
                                    "xAxisWrapLabels": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "yAxisFrom": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "yAxisHidden": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "yAxisPosition": {
                                        "type": "JSON_LITERAL",
                                        "value": "bottom"
                                    },
                                    "yAxisShowGrid": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "yAxisStyle": {
                                        "type": "JSON_LITERAL",
                                        "value": "clean"
                                    },
                                    "yAxisTitle": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    },
                                    "yAxisTo": {
                                        "type": "JSON_LITERAL",
                                        "value": null
                                    }
                                },
                                "slot": null,
                                "styles": null
                            }
                        ],
                        "layout": {
                            "default": {
                                "children": null,
                                "items": [
                                    {
                                        "element_id": "filter_1",
                                        "styles": {}
                                    },
                                    {
                                        "element_id": "horizontal_bar_1",
                                        "styles": {}
                                    },
                                    {
                                        "element_id": "horizontal_bar_2",
                                        "styles": {}
                                    }
                                ],
                                "root": null,
                                "rules": null,
                                "styles": {
                                    "flex-direction": "column",
                                    "min-height": "300px",
                                    "width": "100%"
                                },
                                "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
                                "type": "flex"
                            },
                            "version": "3.0.0"
                        }
                    },
                    "preset": null,
                    "propertyValues": {
                        "ariaRegionHeadingLevel": {
                            "type": "JSON_LITERAL",
                            "value": "1"
                        },
                        "ariaRegionName": {
                            "type": "TRANSLATION_LITERAL",
                            "value": {
                                "code": null,
                                "comment": "",
                                "message": ""
                            }
                        },
                        "ariaRole": {
                            "type": "JSON_LITERAL",
                            "value": ""
                        },
                        "hideEmptyStateUi": {
                            "type": "JSON_LITERAL",
                            "value": true
                        },
                        "includeAriaHeading": {
                            "type": "JSON_LITERAL",
                            "value": false
                        },
                        "slotWrapperBehavior": {
                            "type": "JSON_LITERAL",
                            "value": "fullheight"
                        },
                        "type": {
                            "type": "JSON_LITERAL",
                            "value": "section"
                        }
                    },
                    "slot": "dashboard",
                    "styles": null
                },
                {
                    "definition": {
                        "id": "d356d14b6e293a3020a244b63d278d8f",
                        "type": "MACROPONENT"
                    },
                    "elementId": "metric_results",
                    "elementLabel": "Metric Results",
                    "eventMappings": [],
                    "isHidden": {
                        "type": "JSON_LITERAL",
                        "value": null
                    },
                    "name": "Metric Results",
                    "overrides": {
                        "composition": [
                            {
                                "bundleLink": {
                                    "bundleInstanceId": "recordlist_2",
                                    "elementType": "root",
                                    "originalElementId": "list_bundle"
                                },
                                "conditionals": null,
                                "definition": {
                                    "id": "d356d14b6e293a3020a244b63d278d8f",
                                    "type": "MACROPONENT"
                                },
                                "elementId": "list_bundle",
                                "elementLabel": "Record List",
                                "eventMappings": [],
                                "isHidden": null,
                                "overrides": {
                                    "composition": [
                                        {
                                            "definition": {
                                                "id": "226449101138d0dff1abe0e1566c8b2a",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "filter_2",
                                            "elementLabel": "Filter 2",
                                            "eventMappings": [
                                                {
                                                    "eventMappingId": "mYttvvkRDEJYeeddIYJqjQQkThaa",
                                                    "isConfiguration": false,
                                                    "offRowStorageId": null,
                                                    "sourceEventApiName": "sn_component_filte.SN_COMPONENT_FILTER#APPLIED_ITEMS",
                                                    "sourceEventCorrelationId": null,
                                                    "sourceEventDefinition": {
                                                        "apiName": "sn_component_filte.SN_COMPONENT_FILTER#APPLIED_ITEMS",
                                                        "id": null,
                                                        "type": "UXEVENT"
                                                    },
                                                    "sourceEventSysId": null,
                                                    "targets": [
                                                        {
                                                            "broker": null,
                                                            "clientScript": null,
                                                            "clientTransformScript": "",
                                                            "conditional": null,
                                                            "declarativeAction": null,
                                                            "event": {
                                                                "apiName": "sn_uxf.MACROPONENT_STATE_UPDATE_REQUESTED",
                                                                "payload": {
                                                                    "type": "JSON_LITERAL",
                                                                    "value": {
                                                                        "propName": "assesment_run",
                                                                        "value": null
                                                                    }
                                                                },
                                                                "sysId": "32408b42ff7a10109046e490703bf176"
                                                            },
                                                            "operation": null,
                                                            "targetId": "aabbOLAfzhhCaajjKeeddPANeeddtHkPWhs",
                                                            "type": "EVENT"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "isHidden": {
                                                "type": "JSON_LITERAL",
                                                "value": null
                                            },
                                            "preset": null,
                                            "propertyValues": {
                                                "allowTimeSelection": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "allowedDateRanges": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "booleanLabelFalse": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "booleanLabelTrue": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "cascadeScope": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "cascadingConfig": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "datasource": {
                                                    "type": "JSON_LITERAL",
                                                    "value": {
                                                        "payload": {
                                                            "primaryKey": "sys_id",
                                                            "table": "x_maf_core_assessment_run"
                                                        },
                                                        "type": "table"
                                                    }
                                                },
                                                "dateFilterView": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "calendar-reldates"
                                                },
                                                "defaultBoolean": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "defaultDateEnd": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "defaultDateStart": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "defaultSelectedDateRange": {
                                                    "type": "JSON_LITERAL",
                                                    "value": {
                                                        "range": ""
                                                    }
                                                },
                                                "defaultSelectedItems": {
                                                    "type": "JSON_LITERAL",
                                                    "value": []
                                                },
                                                "enableClearFilter": {
                                                    "type": "JSON_LITERAL",
                                                    "value": true
                                                },
                                                "enableResetToDefault": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "filterComponentType": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "singleselect"
                                                },
                                                "filterConfigurations": {
                                                    "binding": {
                                                        "address": [
                                                            "parFilters"
                                                        ]
                                                    },
                                                    "type": "STATE_BINDING"
                                                },
                                                "filterElementLayout": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "vertical"
                                                },
                                                "filterElementType": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "pill"
                                                },
                                                "filterId": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "1jlsb052mjs7fdksfd3s"
                                                },
                                                "filterName": {
                                                    "type": "TRANSLATION_LITERAL",
                                                    "value": {
                                                        "code": null,
                                                        "comment": "",
                                                        "message": "Assesment Run"
                                                    }
                                                },
                                                "filterProperties": {
                                                    "type": "JSON_LITERAL",
                                                    "value": null
                                                },
                                                "isDashboard": {
                                                    "type": "JSON_LITERAL",
                                                    "value": false
                                                },
                                                "isGroup": {
                                                    "type": "JSON_LITERAL",
                                                    "value": false
                                                },
                                                "isShowSelectedValueInPill": {
                                                    "type": "JSON_LITERAL",
                                                    "value": true
                                                },
                                                "maxElements": {
                                                    "type": "JSON_LITERAL",
                                                    "value": 10
                                                },
                                                "primaryActionLabel": {
                                                    "type": "TRANSLATION_LITERAL",
                                                    "value": {
                                                        "code": null,
                                                        "comment": "",
                                                        "message": "Apply"
                                                    }
                                                },
                                                "sort": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "DESC"
                                                },
                                                "targets": {
                                                    "type": "JSON_LITERAL",
                                                    "value": [
                                                        {
                                                            "payload": {
                                                                "primaryKey": "sys_id",
                                                                "table": "x_maf_core_assessment_run"
                                                            },
                                                            "type": "table"
                                                        }
                                                    ]
                                                }
                                            },
                                            "slot": null,
                                            "styles": {}
                                        },
                                        {
                                            "bundleLink": {
                                                "bundleInstanceId": "recordlist_2",
                                                "elementType": "member",
                                                "originalElementId": "record_list_header_1"
                                            },
                                            "conditionals": null,
                                            "definition": {
                                                "id": "b685c9c6773ab64a2c11c88564fc9f62",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "record_list_header_1",
                                            "elementLabel": "Record List Header",
                                            "eventMappings": [],
                                            "isHero": true,
                                            "isHidden": null,
                                            "preset": {
                                                "controllerElementId": "list_controller_2",
                                                "disabledEventTargetIds": [],
                                                "id": "7390b78659717406599eca6a55e68c44"
                                            },
                                            "propertyValues": {},
                                            "slot": null,
                                            "styles": null
                                        },
                                        {
                                            "bundleLink": {
                                                "bundleInstanceId": "recordlist_2",
                                                "elementType": "member",
                                                "originalElementId": "resizable_panes_1"
                                            },
                                            "definition": {
                                                "id": "07b0bb09419d26f0af681796bc548f19",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "resizable_panes_1",
                                            "elementLabel": "Resizable panes 1",
                                            "eventMappings": [],
                                            "isHidden": {
                                                "type": "JSON_LITERAL",
                                                "value": null
                                            },
                                            "overrides": {
                                                "composition": [
                                                    {
                                                        "bundleLink": {
                                                            "bundleInstanceId": "recordlist_2",
                                                            "elementType": "member",
                                                            "originalElementId": "presentational_list_1"
                                                        },
                                                        "conditionals": null,
                                                        "definition": {
                                                            "id": "eee2590820335fa22d8fb7319a825a82",
                                                            "type": "MACROPONENT"
                                                        },
                                                        "elementId": "presentational_list_1",
                                                        "elementLabel": "Presentational List",
                                                        "eventMappings": [],
                                                        "isHero": true,
                                                        "isHidden": null,
                                                        "preset": {
                                                            "controllerElementId": "list_controller_2",
                                                            "disabledEventTargetIds": [],
                                                            "id": "33f6672f7d096e5a32e4e96b497748e4"
                                                        },
                                                        "propertyValues": {
                                                            "options": {
                                                                "type": "JSON_LITERAL",
                                                                "value": {}
                                                            }
                                                        },
                                                        "slot": "left",
                                                        "styles": {}
                                                    },
                                                    {
                                                        "bundleLink": {
                                                            "bundleInstanceId": "recordlist_2",
                                                            "elementType": "member",
                                                            "originalElementId": "list_panel_viewport"
                                                        },
                                                        "definition": {
                                                            "id": "MACROPONENT_VIEWPORT_HEADLESS",
                                                            "type": "MACROPONENT_VIEWPORT_HEADLESS"
                                                        },
                                                        "elementId": "list_panel_viewport",
                                                        "elementLabel": "List Panel Viewport",
                                                        "eventMappings": [],
                                                        "extensionPoints": [
                                                            {
                                                                "controllerElementId": "list_controller_2",
                                                                "name": "List Page Panes",
                                                                "sysId": "4d9e0c2143efa11041505119ebb8f270"
                                                            }
                                                        ],
                                                        "isHidden": {
                                                            "type": "JSON_LITERAL",
                                                            "value": null
                                                        },
                                                        "preset": null,
                                                        "propertyValues": {
                                                            "pageCollectionMode": {
                                                                "type": "JSON_LITERAL",
                                                                "value": true
                                                            }
                                                        },
                                                        "slot": "right",
                                                        "styles": null
                                                    }
                                                ]
                                            },
                                            "preset": {
                                                "controllerElementId": "list_controller_2",
                                                "disabledEventTargetIds": [],
                                                "id": "c98d4a8dfa4f61d096e06642b002039f"
                                            },
                                            "propertyValues": {},
                                            "slot": null,
                                            "styles": null
                                        },
                                        {
                                            "bundleLink": {
                                                "bundleInstanceId": "recordlist_2",
                                                "elementType": "member",
                                                "originalElementId": "pagination_control_1"
                                            },
                                            "conditionals": null,
                                            "definition": {
                                                "id": "63ea66b3c5a122819f729b7254789c34",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "pagination_control_1",
                                            "elementLabel": "Pagination control",
                                            "eventMappings": [],
                                            "isHidden": null,
                                            "preset": {
                                                "controllerElementId": "list_controller_2",
                                                "disabledEventTargetIds": [],
                                                "id": "47d85e949cd381e3930037367b16fdaa"
                                            },
                                            "propertyValues": {},
                                            "slot": "",
                                            "styles": null
                                        },
                                        {
                                            "bundleLink": {
                                                "bundleInstanceId": "recordlist_2",
                                                "elementType": "member",
                                                "originalElementId": "record_list_footer_container_1"
                                            },
                                            "definition": {
                                                "id": "d356d14b6e293a3020a244b63d278d8f",
                                                "type": "MACROPONENT"
                                            },
                                            "elementId": "record_list_footer_container_1",
                                            "elementLabel": "Footer Container",
                                            "eventMappings": [],
                                            "isHidden": {
                                                "operation": {
                                                    "operand": {
                                                        "binding": {
                                                            "address": [
                                                                "list_controller_2",
                                                                "listProps",
                                                                "enableViewAllLink"
                                                            ]
                                                        },
                                                        "type": "DATA_OUTPUT_BINDING"
                                                    },
                                                    "operator": "NOT"
                                                },
                                                "type": "UNARY"
                                            },
                                            "overrides": {
                                                "composition": [
                                                    {
                                                        "bundleLink": {
                                                            "bundleInstanceId": "recordlist_2",
                                                            "elementType": "member",
                                                            "originalElementId": "view_all_link_1"
                                                        },
                                                        "definition": {
                                                            "id": "abe7db0526ec8705a0eff03521febfa3",
                                                            "type": "MACROPONENT"
                                                        },
                                                        "elementId": "view_all_link_1",
                                                        "elementLabel": "View All Link",
                                                        "eventMappings": [],
                                                        "isHidden": null,
                                                        "preset": {
                                                            "controllerElementId": "list_controller_2",
                                                            "disabledEventTargetIds": [],
                                                            "id": "420a0cb7b684a7db1915765e1b4d64d1"
                                                        },
                                                        "propertyValues": {
                                                            "download": {
                                                                "type": "JSON_LITERAL",
                                                                "value": null
                                                            },
                                                            "iconEnd": {
                                                                "type": "JSON_LITERAL",
                                                                "value": null
                                                            },
                                                            "iconStart": {
                                                                "type": "JSON_LITERAL",
                                                                "value": null
                                                            },
                                                            "opensWindow": {
                                                                "type": "JSON_LITERAL",
                                                                "value": false
                                                            },
                                                            "underlined": {
                                                                "type": "JSON_LITERAL",
                                                                "value": false
                                                            }
                                                        },
                                                        "slot": null,
                                                        "styles": {
                                                            "padding": "var(--now-scalable-space--lg)",
                                                            "padding-block-end": "var(--now-scalable-space--lg)",
                                                            "padding-block-start": "var(--now-scalable-space--lg)",
                                                            "padding-inline-end": "var(--now-scalable-space--lg)",
                                                            "padding-inline-start": "var(--now-scalable-space--lg)"
                                                        }
                                                    }
                                                ],
                                                "layout": {
                                                    "default": {
                                                        "children": null,
                                                        "items": [
                                                            {
                                                                "element_id": "view_all_link_1",
                                                                "styles": {
                                                                    "font-size": "var(--now-global-font-size--md)",
                                                                    "margin-inline-start": "var(--now-scalable-space--lg)"
                                                                }
                                                            }
                                                        ],
                                                        "root": null,
                                                        "rules": null,
                                                        "styles": {
                                                            "align-items": "center",
                                                            "display": "flex",
                                                            "flex-direction": "row",
                                                            "height": "40px",
                                                            "width": "100%"
                                                        },
                                                        "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
                                                        "type": "flex"
                                                    },
                                                    "version": "3.0.0"
                                                }
                                            },
                                            "preset": null,
                                            "propertyValues": {
                                                "ariaRegionHeadingLevel": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "1"
                                                },
                                                "ariaRegionName": {
                                                    "type": "TRANSLATION_LITERAL",
                                                    "value": {
                                                        "code": null,
                                                        "comment": "",
                                                        "message": ""
                                                    }
                                                },
                                                "ariaRole": {
                                                    "type": "JSON_LITERAL",
                                                    "value": ""
                                                },
                                                "hideEmptyStateUi": {
                                                    "type": "JSON_LITERAL",
                                                    "value": true
                                                },
                                                "includeAriaHeading": {
                                                    "type": "JSON_LITERAL",
                                                    "value": false
                                                },
                                                "slotWrapperBehavior": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "fullheight"
                                                },
                                                "type": {
                                                    "type": "JSON_LITERAL",
                                                    "value": "section"
                                                }
                                            },
                                            "slot": null,
                                            "styles": null
                                        }
                                    ],
                                    "layout": {
                                        "default": {
                                            "children": null,
                                            "items": [
                                                {
                                                    "element_id": "filter_2",
                                                    "styles": {}
                                                },
                                                {
                                                    "element_id": "record_list_header_1",
                                                    "styles": {}
                                                },
                                                {
                                                    "element_id": "resizable_panes_1",
                                                    "styles": {
                                                        "height": "",
                                                        "min-height": "305px"
                                                    }
                                                },
                                                {
                                                    "element_id": "pagination_control_1",
                                                    "styles": {
                                                        "min-height": "unset",
                                                        "min-width": "unset"
                                                    }
                                                },
                                                {
                                                    "element_id": "record_list_footer_container_1",
                                                    "styles": {}
                                                }
                                            ],
                                            "root": null,
                                            "rules": null,
                                            "styles": {
                                                "flex-direction": "column",
                                                "height": "100%"
                                            },
                                            "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
                                            "type": "flex"
                                        },
                                        "version": "3.0.0"
                                    }
                                },
                                "preset": null,
                                "propertyValues": {
                                    "ariaRegionHeadingLevel": {
                                        "type": "JSON_LITERAL",
                                        "value": "1"
                                    },
                                    "ariaRegionName": {
                                        "type": "TRANSLATION_LITERAL",
                                        "value": {
                                            "code": null,
                                            "comment": "",
                                            "message": ""
                                        }
                                    },
                                    "ariaRole": {
                                        "type": "JSON_LITERAL",
                                        "value": ""
                                    },
                                    "hideEmptyStateUi": {
                                        "type": "JSON_LITERAL",
                                        "value": true
                                    },
                                    "includeAriaHeading": {
                                        "type": "JSON_LITERAL",
                                        "value": false
                                    },
                                    "type": {
                                        "type": "JSON_LITERAL",
                                        "value": "section"
                                    }
                                },
                                "slot": null,
                                "styles": null
                            }
                        ],
                        "layout": {
                            "default": {
                                "children": null,
                                "items": [
                                    {
                                        "element_id": "list_bundle",
                                        "styles": {}
                                    }
                                ],
                                "root": null,
                                "rules": null,
                                "styles": {
                                    "flex-direction": "column",
                                    "min-height": "300px",
                                    "width": "100%"
                                },
                                "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
                                "type": "flex"
                            },
                            "version": "3.0.0"
                        }
                    },
                    "preset": null,
                    "propertyValues": {
                        "ariaRegionHeadingLevel": {
                            "type": "JSON_LITERAL",
                            "value": "1"
                        },
                        "ariaRegionName": {
                            "type": "TRANSLATION_LITERAL",
                            "value": {
                                "code": null,
                                "comment": "",
                                "message": ""
                            }
                        },
                        "ariaRole": {
                            "type": "JSON_LITERAL",
                            "value": ""
                        },
                        "hideEmptyStateUi": {
                            "type": "JSON_LITERAL",
                            "value": true
                        },
                        "includeAriaHeading": {
                            "type": "JSON_LITERAL",
                            "value": false
                        },
                        "slotWrapperBehavior": {
                            "type": "JSON_LITERAL",
                            "value": "fullheight"
                        },
                        "type": {
                            "type": "JSON_LITERAL",
                            "value": "section"
                        }
                    },
                    "slot": "metric_results",
                    "styles": null
                }
            ],
            "layout": null
        },
        "preset": null,
        "propertyValues": {
            "activeRoute": {
                "icon": "activity-outline",
                "id": "metric_results",
                "label": {
                    "type": "TRANSLATION_LITERAL",
                    "value": {
                        "code": null,
                        "comment": "",
                        "message": "Metric Results"
                    }
                },
                "order": 300,
                "type": "local"
            },
            "ariaLabel": {
                "type": "JSON_LITERAL",
                "value": "Tab List"
            },
            "defaultRoute": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "dynamicTabData": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "enableCollapsing": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "fixedWidth": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "hideLabel": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "initiallyCollapsed": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "items": {
                "container": [],
                "type": "LIST_CONTAINER"
            },
            "maxWidth": {
                "type": "JSON_LITERAL",
                "value": 240
            },
            "position": {
                "type": "JSON_LITERAL",
                "value": "top"
            },
            "selectedTab": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "selectedTabIndex": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "showInlinePadding": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "size": {
                "type": "JSON_LITERAL",
                "value": "md"
            },
            "spaceBetweenItems": {
                "type": "JSON_LITERAL",
                "value": "none"
            },
            "tabStyles": {
                "type": "JSON_LITERAL",
                "value": ".tabset-tabs{\\n\\n}\\n.tabset-container{\\n\\n}"
            },
            "viewportConfiguration": {
                "type": "JSON_LITERAL",
                "value": {
                    "enableDataDrivenTabs": true,
                    "validation": {
                        "icon": {
                            "required": false
                        },
                        "name": {
                            "required": true
                        },
                        "order": {
                            "required": false
                        }
                    }
                }
            }
        },
        "slot": null,
        "styles": {}
    }
]`,
        data: `[
    {
        "definition": {
            "id": "b997a84053021010cbc2ddeeff7b1228",
            "type": "COMPOSITE"
        },
        "elementId": "look_up_multiple_records_1",
        "elementLabel": "Look up multiple records 1",
        "eventMappings": [],
        "inputValues": {
            "encodedQuery": {
                "type": "JSON_LITERAL",
                "value": "ORDERBYDESCsys_created_on"
            },
            "limit": {
                "type": "JSON_LITERAL",
                "value": "1"
            },
            "offset": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "orderBy": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "queryCategory": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "returnFieldMetadata": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "returnFields": {
                "type": "JSON_LITERAL",
                "value": "executive_summary,sys_created_on,assessment_run"
            },
            "sortType": {
                "type": "JSON_LITERAL",
                "value": "asc"
            },
            "table": {
                "type": "JSON_LITERAL",
                "value": "x_maf_core_ai_summary"
            }
        },
        "readEvaluationMode": "EAGER"
    },
    {
        "bundleLinks": [
            {
                "bundleInstanceId": "recordlist_1",
                "elementType": "controller",
                "originalElementId": "list_controller"
            }
        ],
        "definition": {
            "id": "5865e308432021105571609dc7b8f23b",
            "type": "CONTROLLER"
        },
        "dependencies": {},
        "elementId": "list_controller",
        "elementLabel": "List Controller",
        "eventMappings": [
            {
                "eventMappingId": "clkubblwubaaccgffddbhhplggtlhhiiay",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#ADD_NOTIFICATIONS_REQUESTED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#ADD_NOTIFICATIONS_REQUESTED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_1",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": {
                            "apiName": "sn_uxf_page.NOW_UXF_PAGE#ADD_NOTIFICATIONS",
                            "payload": {
                                "container": {
                                    "items": {
                                        "binding": {
                                            "address": [
                                                "items"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            },
                            "sysId": null
                        },
                        "operation": null,
                        "targetId": "clkubblwucaaccgggddbhhpvtfmthffdd",
                        "type": "EVENT"
                    }
                ]
            },
            {
                "eventMappingId": "clkwayluyaacchzddbhhqwnbbmqowii",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#CLEAR_NOTIFICATIONS_REQUESTED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#CLEAR_NOTIFICATIONS_REQUESTED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_1",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": {
                            "apiName": "sn_uxf_page.NOW_UXF_PAGE#CLEAR_NOTIFICATIONS",
                            "payload": {}
                        },
                        "operation": null,
                        "targetId": "clkwayluyaacciaaddbhhqggntpcgpbb",
                        "type": "EVENT"
                    }
                ]
            },
            {
                "eventMappingId": "clmtghpyffaabbcjjddbhhvbbqzjjoywp",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#REFERENCE_LINK_CLICKED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#REFERENCE_LINK_CLICKED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_1",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": null,
                        "operation": {
                            "dataBrokerId": "5865e308432021105571609dc7b8f23b",
                            "operationName": "LIST_CTRL#NAV_ITEM_SELECTED",
                            "parentResourceId": "list_controller",
                            "payload": {
                                "container": {
                                    "isFirstNonRef": {
                                        "binding": {
                                            "address": [
                                                "isFirstNonRef"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "nativeEvent": {
                                        "binding": {
                                            "address": [
                                                "nativeEvent"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "route": {
                                        "type": "JSON_LITERAL",
                                        "value": "record"
                                    },
                                    "row": {
                                        "binding": {
                                            "address": [
                                                "row"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "sys_id": {
                                        "binding": {
                                            "address": [
                                                "sys_id"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "table": {
                                        "binding": {
                                            "address": [
                                                "table"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            }
                        },
                        "targetId": "clmtghpyggaabbcaddbhhvmkgiijjjjddl",
                        "type": "DATABROKER_OP"
                    }
                ]
            },
            {
                "eventMappingId": "clnbbnjjoffiiaaccnpddbhhsffirbbcmbbf",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#CREATE_NEW_RECORD",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#CREATE_NEW_RECORD",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_1",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": null,
                        "operation": {
                            "dataBrokerId": "5865e308432021105571609dc7b8f23b",
                            "operationName": "LIST_CTRL#NAV_ITEM_SELECTED",
                            "parentResourceId": "list_controller",
                            "payload": {
                                "container": {
                                    "external": {
                                        "binding": {
                                            "address": [
                                                "external"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "fields": {
                                        "binding": {
                                            "address": [
                                                "fields"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "multiInstField": "sysId",
                                    "params": {
                                        "binding": {
                                            "address": [
                                                "params"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "passiveNavigation": {
                                        "binding": {
                                            "address": [
                                                "passiveNavigation"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "redirect": {
                                        "binding": {
                                            "address": [
                                                "redirect"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "route": {
                                        "binding": {
                                            "address": [
                                                "route"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "title": {
                                        "binding": {
                                            "address": [
                                                "title"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            }
                        },
                        "targetId": "clnbbnjjoffiiaaccnqddbhhscehheaddve",
                        "type": "DATABROKER_OP"
                    }
                ]
            }
        ],
        "inputValues": {
            "actionConfigId": {
                "binding": {
                    "address": [
                        "actionConfigId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "allRecordsSelected": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "appId": {
                "binding": {
                    "address": [
                        "appId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "columnLimit": {
                "type": "JSON_LITERAL",
                "value": 0
            },
            "columnPreferenceKey": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "columns": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "currentPage": {
                "type": "JSON_LITERAL",
                "value": 0
            },
            "enableCellFiltering": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnFiltering": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnGrouping": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnSorting": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableDeclarativeActions": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableDotWalk": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableInfiniteScroll": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableLiveList": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableQuickEdit": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableQuickFormNavigation": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableReferenceLinks": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enforceViewRulesForQuickForm": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "fetchHighlightedValues": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "filter": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "fixedFilter": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "groupBy": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "highlightedValueConfigId": {
                "binding": {
                    "address": [
                        "highlightedValueConfigId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "listControllerId": {
                "type": "JSON_LITERAL",
                "value": "twsjmfjUB0sh9dMN43lt47G0Fq"
            },
            "listId": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "listType": {
                "type": "JSON_LITERAL",
                "value": "default"
            },
            "liveUpdates": {
                "type": "JSON_LITERAL",
                "value": "off"
            },
            "onlyEnableSelectionWhenRequiredByActions": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "pageSysId": {
                "binding": {
                    "address": [
                        "nowMacroponentSysId"
                    ],
                    "category": "props"
                },
                "type": "CONTEXT_BINDING"
            },
            "table": {
                "type": "JSON_LITERAL",
                "value": "task"
            },
            "view": {
                "type": "JSON_LITERAL",
                "value": ""
            }
        },
        "readEvaluationMode": "EAGER"
    },
    {
        "bundleLinks": [
            {
                "bundleInstanceId": "recordlist_2",
                "elementType": "controller",
                "originalElementId": "list_controller"
            }
        ],
        "definition": {
            "id": "5865e308432021105571609dc7b8f23b",
            "type": "CONTROLLER"
        },
        "dependencies": {},
        "elementId": "list_controller_2",
        "elementLabel": "List Controller 2",
        "eventMappings": [
            {
                "eventMappingId": "clkubblwubaaccgffddbhhplggtlhhiiay",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#ADD_NOTIFICATIONS_REQUESTED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#ADD_NOTIFICATIONS_REQUESTED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_2",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": {
                            "apiName": "sn_uxf_page.NOW_UXF_PAGE#ADD_NOTIFICATIONS",
                            "payload": {
                                "container": {
                                    "items": {
                                        "binding": {
                                            "address": [
                                                "items"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            },
                            "sysId": null
                        },
                        "operation": null,
                        "targetId": "clkubblwucaaccgggddbhhpvtfmthffdd",
                        "type": "EVENT"
                    }
                ]
            },
            {
                "eventMappingId": "clkwayluyaacchzddbhhqwnbbmqowii",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#CLEAR_NOTIFICATIONS_REQUESTED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#CLEAR_NOTIFICATIONS_REQUESTED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_2",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": {
                            "apiName": "sn_uxf_page.NOW_UXF_PAGE#CLEAR_NOTIFICATIONS",
                            "payload": {}
                        },
                        "operation": null,
                        "targetId": "clkwayluyaacciaaddbhhqggntpcgpbb",
                        "type": "EVENT"
                    }
                ]
            },
            {
                "eventMappingId": "clmtghpyffaabbcjjddbhhvbbqzjjoywp",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#REFERENCE_LINK_CLICKED",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#REFERENCE_LINK_CLICKED",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_2",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": null,
                        "operation": {
                            "dataBrokerId": "5865e308432021105571609dc7b8f23b",
                            "operationName": "LIST_CTRL#NAV_ITEM_SELECTED",
                            "parentResourceId": "list_controller_2",
                            "payload": {
                                "container": {
                                    "isFirstNonRef": {
                                        "binding": {
                                            "address": [
                                                "isFirstNonRef"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "nativeEvent": {
                                        "binding": {
                                            "address": [
                                                "nativeEvent"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "route": {
                                        "type": "JSON_LITERAL",
                                        "value": "record"
                                    },
                                    "row": {
                                        "binding": {
                                            "address": [
                                                "row"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "sys_id": {
                                        "binding": {
                                            "address": [
                                                "sys_id"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "table": {
                                        "binding": {
                                            "address": [
                                                "table"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            }
                        },
                        "targetId": "clmtghpyggaabbcaddbhhvmkgiijjjjddl",
                        "type": "DATABROKER_OP"
                    }
                ]
            },
            {
                "eventMappingId": "clnbbnjjoffiiaaccnpddbhhsffirbbcmbbf",
                "isConfiguration": false,
                "offRowStorageId": null,
                "sourceEventApiName": "sn_now_list_common.LIST_CTRL#CREATE_NEW_RECORD",
                "sourceEventCorrelationId": null,
                "sourceEventDefinition": {
                    "apiName": "sn_now_list_common.LIST_CTRL#CREATE_NEW_RECORD",
                    "id": null,
                    "type": "UXEVENT"
                },
                "sourceEventSysId": null,
                "targets": [
                    {
                        "broker": null,
                        "bundleLinks": [
                            {
                                "bundleInstanceId": "recordlist_2",
                                "elementType": "eventMappingTarget"
                            }
                        ],
                        "clientScript": null,
                        "conditional": null,
                        "declarativeAction": null,
                        "event": null,
                        "operation": {
                            "dataBrokerId": "5865e308432021105571609dc7b8f23b",
                            "operationName": "LIST_CTRL#NAV_ITEM_SELECTED",
                            "parentResourceId": "list_controller_2",
                            "payload": {
                                "container": {
                                    "external": {
                                        "binding": {
                                            "address": [
                                                "external"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "fields": {
                                        "binding": {
                                            "address": [
                                                "fields"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "multiInstField": "sysId",
                                    "params": {
                                        "binding": {
                                            "address": [
                                                "params"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "passiveNavigation": {
                                        "binding": {
                                            "address": [
                                                "passiveNavigation"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "redirect": {
                                        "binding": {
                                            "address": [
                                                "redirect"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "route": {
                                        "binding": {
                                            "address": [
                                                "route"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    },
                                    "title": {
                                        "binding": {
                                            "address": [
                                                "title"
                                            ]
                                        },
                                        "type": "EVENT_PAYLOAD_BINDING"
                                    }
                                },
                                "type": "MAP_CONTAINER"
                            }
                        },
                        "targetId": "clnbbnjjoffiiaaccnqddbhhscehheaddve",
                        "type": "DATABROKER_OP"
                    }
                ]
            }
        ],
        "inputValues": {
            "actionConfigId": {
                "binding": {
                    "address": [
                        "actionConfigId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "allRecordsSelected": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "appId": {
                "binding": {
                    "address": [
                        "appId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "columnFilteringPopoverDisplay": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "columnLimit": {
                "type": "JSON_LITERAL",
                "value": 0
            },
            "columnPreferenceKey": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "columns": {
                "type": "JSON_LITERAL",
                "value": "assessment_run,metric_definition.label,metric_definition.category,raw_value,metric_definition.target_value,normalized_score,rag_status,collected_at"
            },
            "currentPage": {
                "type": "JSON_LITERAL",
                "value": 0
            },
            "enableCardClickOpen": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableCellFiltering": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnFiltering": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnGrouping": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableColumnSorting": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableDeclarativeActions": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableDotWalk": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enableInfiniteScroll": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableLiveList": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableOnlySingleSelection": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableQuickEdit": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableQuickFormNavigation": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "enableReferenceLinks": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "enforceViewRulesForQuickForm": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "fetchHighlightedValues": {
                "type": "JSON_LITERAL",
                "value": true
            },
            "filter": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "fixedFilter": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "groupBy": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "highlightedValueConfigId": {
                "binding": {
                    "address": [
                        "highlightedValueConfigId"
                    ],
                    "category": "app"
                },
                "type": "CONTEXT_BINDING"
            },
            "listControllerId": {
                "type": "JSON_LITERAL",
                "value": "CiNOZvezDUKB43OIAjIgE47p6c"
            },
            "listId": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "listType": {
                "type": "JSON_LITERAL",
                "value": "simple"
            },
            "liveUpdates": {
                "type": "JSON_LITERAL",
                "value": "off"
            },
            "nestBy": {
                "type": "JSON_LITERAL",
                "value": ""
            },
            "onlyEnableSelectionWhenRequiredByActions": {
                "type": "JSON_LITERAL",
                "value": false
            },
            "pageSysId": {
                "binding": {
                    "address": [
                        "nowMacroponentSysId"
                    ],
                    "category": "props"
                },
                "type": "CONTEXT_BINDING"
            },
            "rowLimit": {
                "type": "JSON_LITERAL",
                "value": 40
            },
            "showListOpenedByLinkSection": {
                "type": "JSON_LITERAL",
                "value": null
            },
            "table": {
                "type": "JSON_LITERAL",
                "value": "x_maf_core_metric_result"
            },
            "view": {
                "type": "JSON_LITERAL",
                "value": ""
            }
        },
        "readEvaluationMode": "EAGER"
    }
]`,
        disable_auto_reflow: 'false',
        dispatched_events: '9965b79853030110aab9ddeeff7b1240',
        extends: '2395ddb853772110784cddeeff7b1251',
        form_factors: '{}',
        internal_event_mappings: '{}',
        layout: `{
    "default": {
        "children": null,
        "items": [
            {
                "element_id": "tabs_1",
                "styles": {}
            }
        ],
        "root": null,
        "rules": null,
        "styles": {
            "flex-direction": "column"
        },
        "templateId": "5832fd4d53c31010e6bcddeeff7b12db",
        "type": "flex"
    },
    "version": "3.0.0"
}`,
        name: 'Overview default',
        props: '[]',
        required_translations: `[ {
  "message" : "AI Report",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Apply",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Assesment Run",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Categories",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Dashboard",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Latest Assesment Review",
  "code" : "",
  "comment" : ""
}, {
  "message" : "MAF Category Score",
  "code" : "",
  "comment" : ""
}, {
  "message" : "MAF Sub-category Score",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Metric Results",
  "code" : "",
  "comment" : ""
}, {
  "message" : "No data available.",
  "code" : "",
  "comment" : ""
}, {
  "message" : "Sub-categories",
  "code" : "",
  "comment" : ""
} ]`,
        schema_version: '1.0.0',
        state_persistence_config: '[]',
        state_properties: `[
    {
        "description": "",
        "fieldType": "string",
        "id": "",
        "initialValue": {
            "type": "JSON_LITERAL",
            "value": null
        },
        "label": "newClientStateParam1",
        "name": "assesment_run",
        "shape": ""
    }
]`,
        style_config: `{
    "classes": [
        {
            "default": {
                "base": {
                    "box-sizing": "border-box",
                    "font-size": "0.9375rem",
                    "line-height": "1.6",
                    "max-width": "none",
                    "width": "100%"
                }
            },
            "name": "maf-ai-llm-summary"
        }
    ],
    "rules": []
}`,
    },
})
