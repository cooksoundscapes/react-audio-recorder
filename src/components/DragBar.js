import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { Tooltip } from '@material-ui/core';
import { useEditor } from './WaveTable';

const mkclasses = makeStyles( ({palette}) => ({
    touchArea: {
        position: 'absolute',
        top: 0,
        width: 40,
        height: '100%',
        cursor: 'w-resize'
    },
    start: {
        position: 'absolute',
        top: 1,
        left: 0,
        width: 2,
        height: '100%',
        opacity: .8,
        backgroundColor: palette.secondary.main,
        '&:after': {
            content: '""',
            position: 'relative',
            display: 'block',
            left: 2,
            color: palette.secondary.dark,
            borderTop: `14px solid`,
            borderRight: '14px solid transparent'
        },
    },
    end: {
        position: 'absolute',
        top: 1,
        left: 38,
        width: 2,
        height: '100%',
        opacity: .8,
        backgroundColor: palette.secondary.main,
        '&:after': {
            content: '""',
            position: 'relative',
            display: 'block',
            left: -13,
            color: palette.secondary.dark,
            borderTop: `14px solid`,
            borderLeft: '14px solid transparent'
        },
    }
}))

const DragBar = props => {
    const types = mkclasses();
    const [pos, setPos] = useState(null);
    const [ratio, setRatio] = useState(props.position)
    const {cnv, box, src, clipArea, setClipArea} = useEditor();
    
    useEffect( () => {
        const maxLeft = cnv.current ? cnv.current.width : 0;
        let newRatio = pos ? (pos / maxLeft) * 100 : props.position;
        if (props.type == 'start') {
            setClipArea([newRatio, clipArea[1]]);
        }
        else if (props.type == 'end') {
            newRatio = pos ? ((pos+40) / maxLeft) * 100 : props.position;
            setClipArea([clipArea[0], newRatio]);
        }
        setRatio(newRatio)
    }, [pos])

    const getPos  = () => ratio * .01 * (cnv.current ? cnv.current.width : 0) - (props.type == 'end' ? 40 : 0);
    const getTime = () => (ratio * .01 * (src ? src.duration : 0)).toFixed(2);

    const dragHandler = event => {
        const eventType = event.nativeEvent;
        const emptyImg = document.createElement('span');
        const object = event.currentTarget;
        const startObjectPos = object.offsetLeft;
        let startDragPos;
        if (eventType instanceof DragEvent) startDragPos = event.clientX;
        else if (eventType instanceof TouchEvent) startDragPos = event.touches[0].clientX;
        let move, fallbackEnd = 0, endedAt, maxLeft;
        if (eventType instanceof DragEvent) event.dataTransfer.setDragImage(emptyImg,0,0);   
       
        const allowDrop = e => e.preventDefault();

        const draggin = ev => {
            let clientX;
            if (eventType instanceof DragEvent) clientX = ev.clientX;
            else if (eventType instanceof TouchEvent) clientX = ev.touches[0].clientX;
            move = clientX - startDragPos + startObjectPos;
            if (move <= 0) {
                endedAt = fallbackEnd;
            } else {
                move = Math.max(0, Math.min(move, maxLeft-40));
                endedAt = move; 
                fallbackEnd = move;
            }
            setPos(endedAt);
        }
        const endrag = () => {
            if (eventType instanceof DragEvent){
                object.removeEventListener('drag', draggin);
                object.removeEventListener('dragend', endrag);
            } else if (eventType instanceof TouchEvent){
                object.removeEventListener('touchmove', draggin);
                object.removeEventListener('touchend', endrag);
            }
            box.current.removeEventListener('dragover', allowDrop); 
        }
        if (box.current) {
            box.current.addEventListener('dragover',allowDrop);
        }
        if (cnv.current) {
            maxLeft = cnv.current.width;
        }
        if (eventType instanceof DragEvent){
            object.addEventListener('drag', draggin, false);
            object.addEventListener('dragend', endrag, false); 
        } else if (eventType instanceof TouchEvent){
            object.addEventListener('touchmove', draggin, {passive: true});
            object.addEventListener('touchend', endrag, false); 
        }
        
    }

    return (
        <Tooltip title={`Drag to clip; Currently at ${getTime()}s`} 
                 placement='right' interactive leaveDelay={10}>

            <div draggable={true} className={types.touchArea} 
                style={{left: getPos()}} onTouchStart={dragHandler} onDragStart={dragHandler} >

                <div className={[props.className, types[props.type]].join(' ')} 
                    style={props.style}></div>
                    
            </div>
        </Tooltip>
    )
}

export default DragBar;