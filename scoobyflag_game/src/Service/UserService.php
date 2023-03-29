<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Component\Serializer\SerializerInterface;

class UserService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepository)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
    }

    public function getEventUserAndAllShitbyDistance(User $user, $distanceView)
    {

        $latitudeParam = ($distanceView / 1000) * 110.574;
        $longitudeParam = ($distanceView / 1000) * (110.320 . cos($latitudeParam));

        $latitudeMax = $user->getLatitude() + $latitudeParam;
        $latitudeMin = $user->getLatitude() - $latitudeParam;
        $longitudeMax = $user->getLongitude() - $longitudeParam;
        $longitudeMin = $user->getLongitude() - $longitudeParam;""
    }
    public function save(User $user)
    {
        $this->em->persist($user);
        $this->em->flush($user);
    }
}
