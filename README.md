# path-decimation
At SolveQ, a large number of our projects deal in some way with GPS data. Between tracking lost pets to the recent cool bike trip you've done, we're no strangers to having to deal with *very* large geo datasets. 

Unfortuately, these datasets pose unique problems, both when storing, transmitting and retrieving geo datasets. After all, when a one-hour walk recorded for your dog ranges in the tens of thousands of records, retrieving this very quickly turns into unnecessary megabytes of data and time spent watching a loader. Worse still, displaying all these in most map components on mobile devices causes a very large amount of memory to be used, and a large amount of processing power when panning to other areas.

Some approaches such as segmenting tracks and occluding segments that are out of view of the current zone can help, and we've used those aggressively wherever possible. However, sometimes, it may just be worth to remove unnecessary points from a track to condense it. After all, if you're walking in a straight line for a while, do you absolutely need to transfer all the intermediate points?

## Algorithms

We've summarized the algorithms in this repository, their performance and their drawbacks below:

| Algorith        | Temporal? | Batch                            | Online         |
-----------------------------------------------------------------------------------
| Douglas-Peucker | No        | Yes (`O(n log n)`)               | No             |
| STTrace         | Yes       | Yes (`O(1/n log N/M log M)`)     | Yes (`O(n^2)`) |
| Bellman's       | No        | Yes (`O(n^2)`)                   | Yes (`O(n^2)`) |

## Interfaces

Two interfaces, `DecimateOnline` and `DecimateBatch`, are provided; these allow developers to easily identify algorithms that are designed to be used on a fixed set of data (`Batch`), and the algorithms that allow on-the-fly insertion of points (`Online`).

## Implementation

### STTrace

STTrace was originally described in [M. Potamias, K. Patroumpas, and T. Sellis. Sampling Trajectory Streams with Spatiotemporal Criteria. In 18th Intl. Conf. on Scientific and Statistical Database Management (SSDBM’06), pages 275–284, 2006.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.85.9949&rep=rep1&type=pdf), and uses an Euclidean norm as sampling input. Whenever a point is inserted, the Euclidean norm of each point with respect to its neighbors is calculated. This norm is then used to decimate the buffer, with the smallest norms (= the closest point to their respective neighbors) are removed.

For our implementation, we use a static compression value as input; for our use cases, this allowed us to quickly and efficiently derive a path with a targeted length, while removing every extraneous and near-duplicate point, both stemming from GPS jitter, and from people just taking breaks.

