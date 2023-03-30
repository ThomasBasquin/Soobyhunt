<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Repository\ItemRepository;
use App\Repository\ObjectiveRepository;
use Symfony\Component\Serializer\SerializerInterface;

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

    //   export function pointInCircle(pointLat, pointLng, circle) {
    //     const {circleLat, circleLng, circleRadius} = circle;

    //     distanceOfPointFromCircleCenter = distanceCalculation(
    //       pointLat,
    //       pointLng,
    //       circleLat,
    //       circleLng,
    //     );

    //     return distanceOfPointFromCircleCenter <= circleRadius ? true : false;
    //   }

    public function getEventUserAndAllShitbyDistance(User $user, $distanceView)
    {
        $distanceView = 300 / 1000;
        // avoir le "carré" pour avoir un premier jet d'objet à proximité
        $latitudeParam = ($distanceView) / 110.574;
        $longitudeParam = $distanceView / (110.320 * cos($latitudeParam))  ;

        $latitudeMax = $user->getLatitude() + $latitudeParam;
        $latitudeMin = $user->getLatitude() - $latitudeParam;
        $longitudeMax = $user->getLongitude() + $longitudeParam;
        $longitudeMin = $user->getLongitude() - $longitudeParam;
        // $latitudeParam = ($distanceView / 1000) * 110.574;

        dump([$latitudeParam, $longitudeParam, $distanceView]);
        dump([$latitudeMin, $latitudeMax, $longitudeMin, $longitudeMax]);


        $users = $this->userRepository->findByTeam($user);
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
