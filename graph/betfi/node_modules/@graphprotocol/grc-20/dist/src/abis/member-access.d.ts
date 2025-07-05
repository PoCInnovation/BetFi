export declare const abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "ApprovalCastForbidden";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "DaoUnauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidInterface";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ProposalCreationForbiddenOnSameBlock";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }];
    readonly name: "ProposalExecutionForbidden";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "startDate";
        readonly type: "uint64";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "endDate";
        readonly type: "uint64";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "member";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "dao";
        readonly type: "address";
    }];
    readonly name: "AddMemberProposalCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "previousAdmin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "newAdmin";
        readonly type: "address";
    }];
    readonly name: "AdminChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "editor";
        readonly type: "address";
    }];
    readonly name: "Approved";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "beacon";
        readonly type: "address";
    }];
    readonly name: "BeaconUpgraded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint8";
        readonly name: "version";
        readonly type: "uint8";
    }];
    readonly name: "Initialized";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "proposalDuration";
        readonly type: "uint64";
    }];
    readonly name: "MultisigSettingsUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "startDate";
        readonly type: "uint64";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "endDate";
        readonly type: "uint64";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "metadata";
        readonly type: "bytes";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly indexed: false;
        readonly internalType: "struct IDAO.Action[]";
        readonly name: "actions";
        readonly type: "tuple[]";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "allowFailureMap";
        readonly type: "uint256";
    }];
    readonly name: "ProposalCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }];
    readonly name: "ProposalExecuted";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "editor";
        readonly type: "address";
    }];
    readonly name: "Rejected";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "implementation";
        readonly type: "address";
    }];
    readonly name: "Upgraded";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "PROPOSER_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "UPDATE_MULTISIG_SETTINGS_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "UPGRADE_PLUGIN_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "_account";
        readonly type: "address";
    }];
    readonly name: "canApprove";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }];
    readonly name: "canExecute";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "dao";
    readonly outputs: readonly [{
        readonly internalType: "contract IDAO";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }];
    readonly name: "execute";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }];
    readonly name: "getProposal";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "executed";
        readonly type: "bool";
    }, {
        readonly internalType: "uint16";
        readonly name: "approvals";
        readonly type: "uint16";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint16";
            readonly name: "minApprovals";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint64";
            readonly name: "snapshotBlock";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "startDate";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "endDate";
            readonly type: "uint64";
        }];
        readonly internalType: "struct MemberAccessPlugin.ProposalParameters";
        readonly name: "parameters";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly internalType: "struct IDAO.Action[]";
        readonly name: "actions";
        readonly type: "tuple[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "failsafeActionMap";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "_account";
        readonly type: "address";
    }];
    readonly name: "hasApproved";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
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
    readonly inputs: readonly [{
        readonly internalType: "contract IDAO";
        readonly name: "_dao";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint64";
            readonly name: "proposalDuration";
            readonly type: "uint64";
        }];
        readonly internalType: "struct MemberAccessPlugin.MultisigSettings";
        readonly name: "_multisigSettings";
        readonly type: "tuple";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "lastMultisigSettingsChange";
    readonly outputs: readonly [{
        readonly internalType: "uint64";
        readonly name: "";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "multisigSettings";
    readonly outputs: readonly [{
        readonly internalType: "uint64";
        readonly name: "proposalDuration";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "pluginType";
    readonly outputs: readonly [{
        readonly internalType: "enum IPlugin.PluginType";
        readonly name: "";
        readonly type: "uint8";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "proposalCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_metadata";
        readonly type: "bytes";
    }, {
        readonly internalType: "address";
        readonly name: "_proposedMember";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_proposer";
        readonly type: "address";
    }];
    readonly name: "proposeAddMember";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "proposalId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "proxiableUUID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_proposalId";
        readonly type: "uint256";
    }];
    readonly name: "reject";
    readonly outputs: readonly [];
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
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint64";
            readonly name: "proposalDuration";
            readonly type: "uint64";
        }];
        readonly internalType: "struct MemberAccessPlugin.MultisigSettings";
        readonly name: "_multisigSettings";
        readonly type: "tuple";
    }];
    readonly name: "updateMultisigSettings";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newImplementation";
        readonly type: "address";
    }];
    readonly name: "upgradeTo";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "upgradeToAndCall";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
//# sourceMappingURL=member-access.d.ts.map