```cpp
conda activate robot
source /opt/ros/noetic/setup.bash
// go to TurtleBOt_Gazebo/catkin_ws/src directory
cd /mnt/B69AD3A69AD36183/Projects/ROBOT_GMAP_IP/catkin_ws
export TURTLEBOT3_MODEL=burger
export PROJ=/mnt/B69AD3A69AD36183/Projects/Robot
source devel/setup.bash
clear
```

catkin build -DPYTHON_EXECUTABLE=/usr/bin/python3 -DPYTHON_INCLUDE_DIR=/usr/include/python3.8

git clone <git_URL> -b <branch_name>

source devel/setup.bash
roslaunch turtlebot3_gazebo turtlebot3_world.launch

/mnt/B69AD3A69AD36183/Projects/Robot

git clone https://github.com/ROBOTIS-GIT/turtlebot3_simulations.git -b noetic-devel
git clone https://github.com/ROBOTIS-GIT/turtlebot3.git -b noetic-devel
git clone https://github.com/ROBOTIS-GIT/turtlebot3_msgs.git -b noetic-devel

# URDF

## Joints

4:
revolute, Prismatic, Continuous, Fixed
