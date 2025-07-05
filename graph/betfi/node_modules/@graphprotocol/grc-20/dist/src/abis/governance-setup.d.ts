export declare const abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract PluginSetupProcessor";
        readonly name: "pluginSetupProcessorAddress";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "actualLength";
        readonly type: "uint256";
    }];
    readonly name: "InvalidHelpers";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "mainVotingPlugin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "memberAccessPlugin";
        readonly type: "address";
    }];
    readonly name: "GeoGovernancePluginsCreated";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "decodeInstallationParams";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum MajorityVotingBase.VotingMode";
            readonly name: "votingMode";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint32";
            readonly name: "supportThreshold";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint64";
            readonly name: "duration";
            readonly type: "uint64";
        }];
        readonly internalType: "struct MajorityVotingBase.VotingSettings";
        readonly name: "votingSettings";
        readonly type: "tuple";
    }, {
        readonly internalType: "address[]";
        readonly name: "initialEditors";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint64";
        readonly name: "memberAccessProposalDuration";
        readonly type: "uint64";
    }, {
        readonly internalType: "address";
        readonly name: "pluginUpgrader";
        readonly type: "address";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "decodeUninstallationParams";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "pluginUpgrader";
        readonly type: "address";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum MajorityVotingBase.VotingMode";
            readonly name: "votingMode";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint32";
            readonly name: "supportThreshold";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint64";
            readonly name: "duration";
            readonly type: "uint64";
        }];
        readonly internalType: "struct MajorityVotingBase.VotingSettings";
        readonly name: "_votingSettings";
        readonly type: "tuple";
    }, {
        readonly internalType: "address[]";
        readonly name: "_initialEditors";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint64";
        readonly name: "_memberAccessProposalDuration";
        readonly type: "uint64";
    }, {
        readonly internalType: "address";
        readonly name: "_pluginUpgrader";
        readonly type: "address";
    }];
    readonly name: "encodeInstallationParams";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_pluginUpgrader";
        readonly type: "address";
    }];
    readonly name: "encodeUninstallationParams";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "implementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "memberAccessPluginImplementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "prepareInstallation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "mainVotingPlugin";
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
        readonly name: "_payload";
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
        readonly name: "permissionChanges";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly internalType: "uint16";
        readonly name: "_currentBuild";
        readonly type: "uint16";
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
        readonly name: "_payload";
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
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "_interfaceId";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=governance-setup.d.ts.map