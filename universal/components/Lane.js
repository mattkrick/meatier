import React, {Component, PropTypes} from 'react';
import EditableContainer from '../containers/EditableContainer.js';


export default class Lane extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    noteActions: PropTypes.object.isRequired,
    lane: PropTypes.object.isRequired,
    notes: PropTypes.array.isRequired
  };

  render() {
    const {actions:{updateLane, deleteLane},
      noteActions: {addNote}, lane, dispatch, initialValues, formKey} = this.props;
    return (
      <div className="lane">
        <div className="lane-header">
          <EditableContainer item={lane}
                    //editItem={editLane}
                    updateItem={updateLane}
                    deleteItem={deleteLane}
                    dispatch={dispatch}
                    formKey={formKey}
                    initialValues={initialValues}/>
          <div className="lane-add-note">
            <button onClick={() =>addNote(lane.id)}>+</button>
          </div>
        </div>
      </div>
    )
  }

  //<Notes notes={notes} actions={actions} laneId={lane.id}/>
}
