import Home from "./Home";
import { connect } from "react-redux";
import { createUser, receiveUnencryptedMessage } from "../../actions";

const mapStateToProps = state => {
    const me = state.room.members.find(member => member.id === state.user.id);

    return {
        userId: state.user.id,
        username: state.user.username,
        members: state.room.members.filter(m => m.username && m.id),
        roomId: state.room.id,
        roomLocked: state.room.isLocked,
        iAmOwner: Boolean(me && me.isOwner),
    }
}

const mapDispatchToProps = {
    createUser,
    receiveUnencryptedMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)