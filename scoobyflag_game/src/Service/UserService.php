<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Repository\ItemRepository;
use App\Repository\ObjectiveRepository;
use Symfony\Component\Serializer\SerializerInterface;

use function PHPSTORM_META\type;

class UserService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private ItemRepository $itemRepository;
    private ObjectiveRepository $objectiveRepository;

    public function __construct(ObjectiveRepository $objectiveRepository, ItemRepository $itemRepository, EntityManagerInterface $em, UserRepository $userRepository)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->itemRepository = $itemRepository;
        $this->objectiveRepository = $objectiveRepository;
    }

    public function findAll()
    {
        return $this->userRepository->findAll();
    }

    public function findby($criteria, $orderBy = null, $limit = null, $offset = null)
    {
        return $this->userRepository->findBy($criteria, $orderBy, $limit, $offset);
    }

    public function findAllWithoutUser(User $withoutUser){
        $users = $this->findAll() ?? [];

        $returnedUsers=[];
        
        foreach ($users as $user) {
            if($withoutUser->getId() != $user->getId()){
                $returnedUsers[]=$user;
            }
        }

        return $returnedUsers;
    }



    public function getEventUserAndAllShitbyDistance(User $user, $distanceViewRadius)
    {
        $distanceView = $distanceViewRadius / 1000;
        // avoir le "carré" pour avoir un premier jet d'objet à proximité
        $latitudeParam = ($distanceView) / 110.574;
        $longitudeParam = $distanceView / (110.320 * cos($latitudeParam));

        $latitudeMax = $user->getLatitude() + $latitudeParam;
        $latitudeMin = $user->getLatitude() - $latitudeParam;
        $longitudeMax = $user->getLongitude() + $longitudeParam;
        $longitudeMin = $user->getLongitude() - $longitudeParam;
        // $latitudeParam = ($distanceView / 1000) * 110.574;



        $users = $this->userRepository->findByTeam($user, $latitudeMin, $latitudeMax, $longitudeMin, $longitudeMax);
        $items = $this->itemRepository->findByLocation($latitudeMin, $latitudeMax, $longitudeMin, $longitudeMax);
        $objectives = $this->objectiveRepository->findByLocation($latitudeMin, $latitudeMax, $longitudeMin, $longitudeMax);

        return ["users" => $users, 'items' =>  $items, 'mechants' => $objectives];
        // return [];
        // avoir les objets par rapport au radius en cercle WIP


        // $longitudeParam = ($distanceView / 1000) * (110.320 . cos($latitudeParam));

        // $latitudeMax = $user->getLatitude() + $latitudeParam;
        // $latitudeMin = $user->getLatitude() - $latitudeParam;
        // $longitudeMax = $user->getLongitude() - $longitudeParam;
        // $longitudeMin = $user->getLongitude() - $longitudeParam;
    }

    public function getUsersByItemView($longitude, $latitude, $distanceViewRadius)
    {
        $distanceView = $distanceViewRadius / 1000;

        $latitudeParam = ($distanceView) / 110.574;
        $longitudeParam = $distanceView / (110.320 * cos($latitudeParam));

        $latitudeMax = $latitude + $latitudeParam;
        $latitudeMin = $latitude - $latitudeParam;
        $longitudeMax = $longitude + $longitudeParam;
        $longitudeMin = $longitude - $longitudeParam;
        
        return $this->userRepository->findWhoSeeItem($latitudeMin, $latitudeMax, $longitudeMin, $longitudeMax);
    }

    function distanceCalculation($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371; //radius of Earth in KM.

        function degreeToRadians($degree)
        {
            return $degree * pi() / 180;
        }

        $differenceOfLatInRadians = degreeToRadians($lat1 - $lat2);
        $differenceOfLngInRadians = degreeToRadians($lng1 - $lng2);

        $lat1InRadians = degreeToRadians($lat1);
        $lat2InRadians = degreeToRadians($lat2);

        $a =
            sin($differenceOfLatInRadians / 2) * sin($differenceOfLatInRadians / 2) +
            cos($lat1InRadians) * cos($lat2InRadians) *
            sin($differenceOfLngInRadians / 2) * sin($differenceOfLngInRadians / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    //   export function pointInCircle(pointLat, pointLng, circle) {
    //     const {circleLat, circleLng, circleRadius} = circle;

    // wip pour fonction php
    //     const {userLat, userLng, visionRange} = circle;
    //     distanceOfPointFromCircleCenter = distanceCalculation(
    //       pointLat,
    //       pointLng,
    //       userLat,
    //       userLng,
    //     );


    //     distanceOfPointFromCircleCenter = distanceCalculation(
    //       pointLat,
    //       pointLng,
    //       circleLat,
    //       circleLng,
    //     );

    //     return distanceOfPointFromCircleCenter <= circleRadius ? true : false;
    //   }

    // const distanceCalculation = (lat1, lng1, lat2, lng2) => {
    //     let earthRadius = 6371; //radius of Earth in KM.
    //     let differenceOfLatInRadians = degreeToRadians(lat1 - lat2);
    //     let differenceOfLngInRadians = degreeToRadians(lng1 - lng2);

    //     let lat1InRadians = degreeToRadians(lat1);
    //     let lat2InRadians = degreeToRadians(lat2);

    //     let a =
    //       Math.sin(differenceOfLatInRadians / 2) *
    //         Math.sin(differenceOfLatInRadians / 2) +
    //       Math.cos(lat1InRadians) *
    //         Math.cos(lat2InRadians) *
    //         Math.sin(differenceOfLngInRadians / 2) *
    //         Math.sin(differenceOfLngInRadians / 2);

    //     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return earthRadius * c;
    //   };


    public function save(User $user)
    {
        $this->em->persist($user);
        $this->em->flush($user);
    }
}
