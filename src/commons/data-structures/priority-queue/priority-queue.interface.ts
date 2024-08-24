export interface PriorityQueueInterface {
  /**
   * @param {any} val
   * @param {number} priority
   */
  enqueue(val: any, priority: number): void;
  /**
   * @returns {NodeQueueInterface} The very first node in this queue
   */
  dequeue(): NodeQueueInterface;
  bubbleUp(): void;
  sinkDown(): void;
  /**
   * @returns {number} Size of this queue
   */
  size(): number;
}

export interface NodeQueueInterface {
  val: any;
  priority: number;
}

