import { PriorityQueueInterface, NodeQueueInterface } from '@src/commons/data-structures/priority-queue/priority-queue.interface';

/**
 * @implements {PriorityQueueInterface}
 */
export class PriorityQueue implements PriorityQueueInterface {
  private values: any[];
  constructor() {
    this.values = [];
  }
  /**
   * @param {any} val
   * @param {number} priority
   */
  enqueue(val: any, priority: number) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while(idx > 0){
      let parentIdx = Math.floor((idx - 1)/2);
      let parent = this.values[parentIdx];
      if(element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  /**
   * @returns {NodeQueueInterface} The very first node in this queue
   */
  dequeue(): NodeQueueInterface {
    const min = this.values[0];
    const end = this.values.pop();
    if(this.values.length > 0){
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while(true){
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild,rightChild;
      let swap = null;

      if(leftChildIdx < length){
        leftChild = this.values[leftChildIdx];
        if(leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if(rightChildIdx < length){
        rightChild = this.values[rightChildIdx];
        if(
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if(swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
  /**
   * @returns {number} Size of this queue
   */
  size(): number {
    return this.values.length;
  }
}

class Node implements NodeQueueInterface {
  val: any;
  priority: number;

  /**
   * @param {any} val
   * @param {number} priority
   */
  constructor(val: any, priority: number) {
    this.val = val;
    this.priority = priority;
  }
}