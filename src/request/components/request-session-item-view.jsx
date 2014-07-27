var React = require('react');

module.exports = React.createClass({
    render: function() {
        var session = this.props.session,
            containerClass = 'table table-bordered' + (session.online ? ' session-online' : ' session-offline');

        // TODO: temp code only being used to debug atm
        var requests = [];
        for (var i = 0; i < session.latestRequests.length; i++) {
            var request = session.latestRequests[i];
            requests.push(<div key={request.id}>{request.url}</div>)
        }

        return (
            <div className="request-session-item-holder" onClick={this._onClick}>
                <table className={containerClass}>
                    <tr>
                        <td rowSpan="2">
                            <img src={session.url} width="40" />
                        </td>
                        <td>{session.title}</td>
                    </tr>
                    <tr>
                        <td>{session.last}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">{requests}</td>
                    </tr>
                </table>
            </div>
        );
    },
    _onClick: function() {
        console.log(' - ', this.props.session.id);
    }
});
