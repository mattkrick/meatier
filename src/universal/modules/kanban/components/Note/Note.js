import React, {Component, PropTypes} from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import {DragSource, DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import {NOTE} from 'universal/modules/kanban/ducks/notes';

const noteSource = {
  beginDrag(props) {
    return {
      id: props.note.id,
      index: props.note.index,
      startingIndex: props.note.index,
      laneId: props.note.laneId,
      onMove: props.onMove
    };
  },
  isDragging(props, monitor) {
    return props.note.id === monitor.getItem().id
  },
  endDrag: function (props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const {note, updateNote} = props;
    const item = monitor.getItem();
    const updates = {};
    if (item.index !== item.startingIndex) {
      updates.index = item.index;
    }
    if (note.laneId !== item.laneId) {
      updates.laneId = item.laneId
    }
    if (Object.keys(updates).length) {
      updates.id = item.id;
      updateNote(updates)
    }
  }
};

const noteTarget = {
  hover(inTargetProps, monitor, component) {
    const targetProps = {
      id: inTargetProps.note.id,
      index: inTargetProps.note.index,
      laneId: inTargetProps.note.laneId
    };
    const sourceProps = monitor.getItem();
    if (sourceProps.id === targetProps.id) return;
    if (sourceProps.laneId === targetProps.laneId) {
      //make dragging a little nicer
      const targetBoundingRect = findDOMNode(component).getBoundingClientRect();
      const targetMiddleY = targetBoundingRect.top + targetBoundingRect.height / 2;
      const clientOffsetY = monitor.getClientOffset().y;
      if (sourceProps.index < targetProps.index && clientOffsetY < targetMiddleY) {
        return;
      }
      if (sourceProps.index > targetProps.index && clientOffsetY > targetMiddleY) {
        return;
      }
    }
    sourceProps.onMove({
      sourceId: sourceProps.id,
      sourceIndex: sourceProps.index,
      sourceLaneId: sourceProps.laneId,
      targetIndex: targetProps.index,
      targetLaneId: targetProps.laneId,
      monitor
    });
  }
};

@DragSource(NOTE, noteSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget(NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
@pureRender
export default class Note extends React.Component {
  render() {
    const {connectDragSource, connectDropTarget, isDragging, ...props} = this.props;
    return connectDropTarget(connectDragSource(
      <li style={{
          opacity: isDragging ? 0 : 1
        }} {...props}>{props.children}</li>
    ));
  }
}
