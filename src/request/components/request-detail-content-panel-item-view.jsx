'use strict';

var React = require('react');
var requestTabController = require('../request-tab');
var classNames = require('classnames');

module.exports = React.createClass({
    render: function () {
        var request = this.props.request;
        var tab = this.props.tab;
        var name = tab.key;
        
        var containerClass = classNames({
            'tab-content-holder': true,
            'active': this.props.isActive
        });
        
        //var tabContent = requestTabController.resolveTab(name);

        var viewModel;
        
        if (tab.viewModelFactory) {
            viewModel = tab.viewModelFactory();
            
            viewModel.init(request);
        }

        return <div className={containerClass}><tab.component key={name} request={request} tab={tab} viewModel={viewModel}/></div>;
    }
});
