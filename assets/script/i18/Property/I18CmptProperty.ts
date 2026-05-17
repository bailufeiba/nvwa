import { _decorator } from "cc";
import { Component } from "cc";
import { ccenum } from "cc";

import { EBundleName } from "../I18LanguageHelper";
import I18Mgr from "../I18Mgr";

const { ccclass, property } = _decorator;

@ccclass('I18PropertyBase')
export class I18PropertyBase {
    @property({type:ccenum(EBundleName)})
    lang: EBundleName = EBundleName.Default;
}

@ccclass('I18CmptPropertyBase')
export class I18CmptPropertyBase extends Component {

    //@property({ type:[I18PropertyBase], visible: true })
    _property :Array<I18PropertyBase> = [];

    @property({visible: true, tooltip: "如需等待I18Cmpt更改后生效,请勾选.\n如需更改语言后立即生效,取消勾选"})
    _waitChange: boolean = false;

    protected onLoad(): void {
        const self = this;

        if( self._waitChange ){
            self.node.on( "I18Cmpt_Changed", self.doChangeProperty, self );
        }else{
            self.node.on( "I18BundleReady", self.doChangeProperty, self );
        }
    }

    protected onEnable(): void {
        const self = this;
        if( !self._waitChange ){
            self.doChangeProperty();
        }
    }

    getLanguageProperty(){
        const self = this;
        const bundleName = I18Mgr.getInstance().getCurrBundleName();
        for( const proty of self._property ){
            if( proty.lang == bundleName ){
                return proty;
            }
        }
        return null;
    }

    doChangeProperty(){
        const self = this;
        const proty = self.getLanguageProperty();
        if( !proty ) return;
        self.onChangeProperty( proty );
    }

    onChangeProperty( proty: I18PropertyBase ){
        console.warn( "I18CmptPropertyBase onChangeProperty please overwrite this func !" );
    }

    protected onDestroy(): void {
        const self = this;

        if( self._waitChange ){
            self.node.off( "I18Cmpt_Changed", self.doChangeProperty, self );
        }else{            
            self.node.off( "I18BundleReady", self.doChangeProperty, self );
        }
    }

}