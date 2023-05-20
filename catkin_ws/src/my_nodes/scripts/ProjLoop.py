import rospy
from std_msgs.msg import String
import roslaunch
import subprocess
#  RUN AVOIDER ( MOVMENT ) AND LAUNCH GMAP, CHECK INTERVAL TO REDRAW AND 
# Start subprocess to check anomaly

def main():
    # Initialize our node
    rospy.init_node("moving_N_gmap")
    # get the start of each interval
    start = rospy.get_time()
    #ros will try to run this code 10 times/second
    rate = rospy.Rate(1) #1Hz
    # act like a talker node-subscribe to chatter topic
    pub = rospy.Publisher('chatter', String, queue_size=10)

    # LAUNCH Movement (avoid obstacles)
    uuid = roslaunch.rlutil.get_or_generate_uuid(None, False)
    roslaunch.configure_logging(uuid)
    launch = roslaunch.parent.ROSLaunchParent(uuid, 
        ["/home/james/Documents/Programming/Robot/TurtleBOt_Gazebo/catkin_ws/src/my_nodes/launch/avoid_talker.launch"]
        )
    launch.start()
    # # LAUNCH GMAP
    uuid = roslaunch.rlutil.get_or_generate_uuid(None, False)
    roslaunch.configure_logging(uuid)
    launch = roslaunch.parent.ROSLaunchParent(uuid, 
        ["/home/james/Documents/Programming/Robot/TurtleBOt_Gazebo/catkin_ws/src/turtlebot3/turtlebot3_slam/launch/turtlebot3_slam.launch"]
        )
    launch.start()
    rospy.loginfo("started")
    # keep running while master is not shutdown
    while not rospy.is_shutdown():
        cur_time = rospy.get_time()
        # if(cur_time-start >=10):
        if(cur_time-start >=3):
            start = cur_time

            # SAVE MAP
            uuid = roslaunch.rlutil.get_or_generate_uuid(None, False)
            roslaunch.configure_logging(uuid)
            launch = roslaunch.parent.ROSLaunchParent(uuid, 
                ["/home/james/Documents/Programming/Robot/TurtleBOt_Gazebo/catkin_ws/src/my_nodes/launch/auto_saveMap.launch"]
                )
            launch.start()
            # CHECK ANOMALY
            subprocess.run(["python", 
            "/home/james/Documents/Programming/Robot/TurtleBOt_Gazebo/catkin_ws/src/my_nodes/scripts/detect_anomaly.py"
            ])

            print("END ONE INTERVAL")
        # Check out the differences!
        rate.sleep()
    # launch.shutdown()

if __name__ == "__main__":
    try:
        main()
    except rospy.ROSInterruptException:
        pass
