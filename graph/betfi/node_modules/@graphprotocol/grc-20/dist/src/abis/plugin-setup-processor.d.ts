export declare const abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract PluginRepoRegistry";
        readonly name: "_repoRegistry";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }];
    readonly name: "IPluginNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "currentAppliedSetupId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "appliedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "InvalidAppliedSetupId";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint8";
            readonly name: "release";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint16";
            readonly name: "build";
            readonly type: "uint16";
        }];
        readonly internalType: "struct PluginRepo.Tag";
        readonly name: "currentVersionTag";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint8";
            readonly name: "release";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint16";
            readonly name: "build";
            readonly type: "uint16";
        }];
        readonly internalType: "struct PluginRepo.Tag";
        readonly name: "newVersionTag";
        readonly type: "tuple";
    }];
    readonly name: "InvalidUpdateVersion";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PluginAlreadyInstalled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }];
    readonly name: "PluginNonupgradeable";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "proxy";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "implementation";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }];
    readonly name: "PluginProxyUpgradeFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PluginRepoNonexistent";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "SetupAlreadyPrepared";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "SetupApplicationUnauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "SetupNotApplicable";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "appliedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "InstallationApplied";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "contract PluginRepo";
        readonly name: "pluginSetupRepo";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint8";
            readonly name: "release";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint16";
            readonly name: "build";
            readonly type: "uint16";
        }];
        readonly indexed: false;
        readonly internalType: "struct PluginRepo.Tag";
        readonly name: "versionTag";
        readonly type: "tuple";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "address[]";
            readonly name: "helpers";
            readonly type: "address[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }];
        readonly indexed: false;
        readonly internalType: "struct IPluginSetup.PreparedSetupData";
        readonly name: "preparedSetupData";
        readonly type: "tuple";
    }];
    readonly name: "InstallationPrepared";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "UninstallationApplied";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "contract PluginRepo";
        readonly name: "pluginSetupRepo";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint8";
            readonly name: "release";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint16";
            readonly name: "build";
            readonly type: "uint16";
        }];
        readonly indexed: false;
        readonly internalType: "struct PluginRepo.Tag";
        readonly name: "versionTag";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "plugin";
            readonly type: "address";
        }, {
            readonly internalType: "address[]";
            readonly name: "currentHelpers";
            readonly type: "address[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly indexed: false;
        readonly internalType: "struct IPluginSetup.SetupPayload";
        readonly name: "setupPayload";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "enum PermissionLib.Operation";
            readonly name: "operation";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "where";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "who";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "condition";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "permissionId";
            readonly type: "bytes32";
        }];
        readonly indexed: false;
        readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
        readonly name: "permissions";
        readonly type: "tuple[]";
    }];
    readonly name: "UninstallationPrepared";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "appliedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "UpdateApplied";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "contract PluginRepo";
        readonly name: "pluginSetupRepo";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint8";
            readonly name: "release";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint16";
            readonly name: "build";
            readonly type: "uint16";
        }];
        readonly indexed: false;
        readonly internalType: "struct PluginRepo.Tag";
        readonly name: "versionTag";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "plugin";
            readonly type: "address";
        }, {
            readonly internalType: "address[]";
            readonly name: "currentHelpers";
            readonly type: "address[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly indexed: false;
        readonly internalType: "struct IPluginSetup.SetupPayload";
        readonly name: "setupPayload";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address[]";
            readonly name: "helpers";
            readonly type: "address[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }];
        readonly indexed: false;
        readonly internalType: "struct IPluginSetup.PreparedSetupData";
        readonly name: "preparedSetupData";
        readonly type: "tuple";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }];
    readonly name: "UpdatePrepared";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "APPLY_INSTALLATION_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "APPLY_UNINSTALLATION_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "APPLY_UPDATE_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint8";
                    readonly name: "release";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "build";
                    readonly type: "uint16";
                }];
                readonly internalType: "struct PluginRepo.Tag";
                readonly name: "versionTag";
                readonly type: "tuple";
            }, {
                readonly internalType: "contract PluginRepo";
                readonly name: "pluginSetupRepo";
                readonly type: "address";
            }];
            readonly internalType: "struct PluginSetupRef";
            readonly name: "pluginSetupRef";
            readonly type: "tuple";
        }, {
            readonly internalType: "address";
            readonly name: "plugin";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "bytes32";
            readonly name: "helpersHash";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct PluginSetupProcessor.ApplyInstallationParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "applyInstallation";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "plugin";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint8";
                    readonly name: "release";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "build";
                    readonly type: "uint16";
                }];
                readonly internalType: "struct PluginRepo.Tag";
                readonly name: "versionTag";
                readonly type: "tuple";
            }, {
                readonly internalType: "contract PluginRepo";
                readonly name: "pluginSetupRepo";
                readonly type: "address";
            }];
            readonly internalType: "struct PluginSetupRef";
            readonly name: "pluginSetupRef";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }];
        readonly internalType: "struct PluginSetupProcessor.ApplyUninstallationParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "applyUninstallation";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "plugin";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint8";
                    readonly name: "release";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "build";
                    readonly type: "uint16";
                }];
                readonly internalType: "struct PluginRepo.Tag";
                readonly name: "versionTag";
                readonly type: "tuple";
            }, {
                readonly internalType: "contract PluginRepo";
                readonly name: "pluginSetupRepo";
                readonly type: "address";
            }];
            readonly internalType: "struct PluginSetupRef";
            readonly name: "pluginSetupRef";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "initData";
            readonly type: "bytes";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "bytes32";
            readonly name: "helpersHash";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct PluginSetupProcessor.ApplyUpdateParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "applyUpdate";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint8";
                    readonly name: "release";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "build";
                    readonly type: "uint16";
                }];
                readonly internalType: "struct PluginRepo.Tag";
                readonly name: "versionTag";
                readonly type: "tuple";
            }, {
                readonly internalType: "contract PluginRepo";
                readonly name: "pluginSetupRepo";
                readonly type: "address";
            }];
            readonly internalType: "struct PluginSetupRef";
            readonly name: "pluginSetupRef";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct PluginSetupProcessor.PrepareInstallationParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "prepareInstallation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "plugin";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "address[]";
            readonly name: "helpers";
            readonly type: "address[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }];
        readonly internalType: "struct IPluginSetup.PreparedSetupData";
        readonly name: "preparedSetupData";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "uint8";
                    readonly name: "release";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "build";
                    readonly type: "uint16";
                }];
                readonly internalType: "struct PluginRepo.Tag";
                readonly name: "versionTag";
                readonly type: "tuple";
            }, {
                readonly internalType: "contract PluginRepo";
                readonly name: "pluginSetupRepo";
                readonly type: "address";
            }];
            readonly internalType: "struct PluginSetupRef";
            readonly name: "pluginSetupRef";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "plugin";
                readonly type: "address";
            }, {
                readonly internalType: "address[]";
                readonly name: "currentHelpers";
                readonly type: "address[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly internalType: "struct IPluginSetup.SetupPayload";
            readonly name: "setupPayload";
            readonly type: "tuple";
        }];
        readonly internalType: "struct PluginSetupProcessor.PrepareUninstallationParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "prepareUninstallation";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum PermissionLib.Operation";
            readonly name: "operation";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "where";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "who";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "condition";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "permissionId";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
        readonly name: "permissions";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint8";
                readonly name: "release";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint16";
                readonly name: "build";
                readonly type: "uint16";
            }];
            readonly internalType: "struct PluginRepo.Tag";
            readonly name: "currentVersionTag";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint8";
                readonly name: "release";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint16";
                readonly name: "build";
                readonly type: "uint16";
            }];
            readonly internalType: "struct PluginRepo.Tag";
            readonly name: "newVersionTag";
            readonly type: "tuple";
        }, {
            readonly internalType: "contract PluginRepo";
            readonly name: "pluginSetupRepo";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "plugin";
                readonly type: "address";
            }, {
                readonly internalType: "address[]";
                readonly name: "currentHelpers";
                readonly type: "address[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly internalType: "struct IPluginSetup.SetupPayload";
            readonly name: "setupPayload";
            readonly type: "tuple";
        }];
        readonly internalType: "struct PluginSetupProcessor.PrepareUpdateParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "prepareUpdate";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "initData";
        readonly type: "bytes";
    }, {
        readonly components: readonly [{
            readonly internalType: "address[]";
            readonly name: "helpers";
            readonly type: "address[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "enum PermissionLib.Operation";
                readonly name: "operation";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "where";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "who";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "condition";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "permissionId";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct PermissionLib.MultiTargetPermission[]";
            readonly name: "permissions";
            readonly type: "tuple[]";
        }];
        readonly internalType: "struct IPluginSetup.PreparedSetupData";
        readonly name: "preparedSetupData";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "repoRegistry";
    readonly outputs: readonly [{
        readonly internalType: "contract PluginRepoRegistry";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "states";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "blockNumber";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes32";
        readonly name: "currentAppliedSetupId";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "pluginInstallationId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "preparedSetupId";
        readonly type: "bytes32";
    }];
    readonly name: "validatePreparedSetupId";
    readonly outputs: readonly [];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=plugin-setup-processor.d.ts.map