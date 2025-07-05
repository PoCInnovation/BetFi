export declare const abi: readonly [{
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly name: "ActionFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AnyAddressDisallowedForWhoAndWhere";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IPermissionCondition";
        readonly name: "condition";
        readonly type: "address";
    }];
    readonly name: "ConditionInterfacNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IPermissionCondition";
        readonly name: "condition";
        readonly type: "address";
    }];
    readonly name: "ConditionNotAContract";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "GrantWithConditionNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientGas";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "expected";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "actual";
        readonly type: "uint256";
    }];
    readonly name: "NativeTokenDepositAmountMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
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
    }, {
        readonly internalType: "address";
        readonly name: "currentCondition";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "newCondition";
        readonly type: "address";
    }];
    readonly name: "PermissionAlreadyGrantedForDifferentCondition";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PermissionsForAnyAddressDisallowed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint8[3]";
        readonly name: "protocolVersion";
        readonly type: "uint8[3]";
    }];
    readonly name: "ProtocolVersionUpgradeNotSupported";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ReentrantCall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TooManyActions";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
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
    readonly name: "Unauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "callbackSelector";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes4";
        readonly name: "magicNumber";
        readonly type: "bytes4";
    }];
    readonly name: "UnkownCallback";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ZeroAmount";
    readonly type: "error";
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
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes4";
        readonly name: "sig";
        readonly type: "bytes4";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "CallbackReceived";
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
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "_reference";
        readonly type: "string";
    }];
    readonly name: "Deposited";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "actor";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "callId";
        readonly type: "bytes32";
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
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "failureMap";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes[]";
        readonly name: "execResults";
        readonly type: "bytes[]";
    }];
    readonly name: "Executed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "here";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "where";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "who";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "condition";
        readonly type: "address";
    }];
    readonly name: "Granted";
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
        readonly internalType: "bytes";
        readonly name: "metadata";
        readonly type: "bytes";
    }];
    readonly name: "MetadataSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "NativeTokenDeposited";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "daoURI";
        readonly type: "string";
    }];
    readonly name: "NewURI";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "permissionId";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "here";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "where";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "who";
        readonly type: "address";
    }];
    readonly name: "Revoked";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "signatureValidator";
        readonly type: "address";
    }];
    readonly name: "SignatureValidatorSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
        readonly type: "bytes4";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes4";
        readonly name: "callbackSelector";
        readonly type: "bytes4";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes4";
        readonly name: "magicNumber";
        readonly type: "bytes4";
    }];
    readonly name: "StandardCallbackRegistered";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "forwarder";
        readonly type: "address";
    }];
    readonly name: "TrustedForwarderSet";
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
    readonly stateMutability: "nonpayable";
    readonly type: "fallback";
}, {
    readonly inputs: readonly [];
    readonly name: "EXECUTE_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "REGISTER_STANDARD_CALLBACK_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "ROOT_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "SET_METADATA_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "SET_SIGNATURE_VALIDATOR_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "SET_TRUSTED_FORWARDER_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "UPGRADE_DAO_PERMISSION_ID";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
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
        readonly name: "_items";
        readonly type: "tuple[]";
    }];
    readonly name: "applyMultiTargetPermissions";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "enum PermissionLib.Operation";
            readonly name: "operation";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "who";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "permissionId";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct PermissionLib.SingleTargetPermission[]";
        readonly name: "items";
        readonly type: "tuple[]";
    }];
    readonly name: "applySingleTargetPermissions";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "daoURI";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }, {
        readonly internalType: "string";
        readonly name: "_reference";
        readonly type: "string";
    }];
    readonly name: "deposit";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "_callId";
        readonly type: "bytes32";
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
        readonly name: "_actions";
        readonly type: "tuple[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "_allowFailureMap";
        readonly type: "uint256";
    }];
    readonly name: "execute";
    readonly outputs: readonly [{
        readonly internalType: "bytes[]";
        readonly name: "execResults";
        readonly type: "bytes[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "failureMap";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getTrustedForwarder";
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
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "grant";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_permissionId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "contract IPermissionCondition";
        readonly name: "_condition";
        readonly type: "address";
    }];
    readonly name: "grantWithCondition";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_permissionId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "hasPermission";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
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
        readonly name: "_initialOwner";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_trustedForwarder";
        readonly type: "address";
    }, {
        readonly internalType: "string";
        readonly name: "daoURI_";
        readonly type: "string";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint8[3]";
        readonly name: "_previousProtocolVersion";
        readonly type: "uint8[3]";
    }, {
        readonly internalType: "bytes";
        readonly name: "_initData";
        readonly type: "bytes";
    }];
    readonly name: "initializeFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_permissionId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "isGranted";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "_hash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "_signature";
        readonly type: "bytes";
    }];
    readonly name: "isValidSignature";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolVersion";
    readonly outputs: readonly [{
        readonly internalType: "uint8[3]";
        readonly name: "";
        readonly type: "uint8[3]";
    }];
    readonly stateMutability: "pure";
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
        readonly internalType: "bytes4";
        readonly name: "_interfaceId";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes4";
        readonly name: "_callbackSelector";
        readonly type: "bytes4";
    }, {
        readonly internalType: "bytes4";
        readonly name: "_magicNumber";
        readonly type: "bytes4";
    }];
    readonly name: "registerStandardCallback";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_where";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_who";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_permissionId";
        readonly type: "bytes32";
    }];
    readonly name: "revoke";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "newDaoURI";
        readonly type: "string";
    }];
    readonly name: "setDaoURI";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_metadata";
        readonly type: "bytes";
    }];
    readonly name: "setMetadata";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_signatureValidator";
        readonly type: "address";
    }];
    readonly name: "setSignatureValidator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_newTrustedForwarder";
        readonly type: "address";
    }];
    readonly name: "setTrustedForwarder";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "signatureValidator";
    readonly outputs: readonly [{
        readonly internalType: "contract IERC1271";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
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
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=dao.d.ts.map